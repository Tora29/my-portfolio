/**
 * Engineering Graph の集計
 *
 * Works / Notes / Career / Activity に付けられた Tech をビルド時に逆引き・集計し、
 * Tech 一覧・Tech 詳細・関連 Tech の表示に使うデータを作る。
 *
 * このファイルは Astro に依存しない純粋な関数だけを置く（単体テストの対象）。
 * Content Collections からの読み込みは load-graph.ts が行う。
 *
 * 設計：.users/design/engineering-graph.md §5〜§7
 */
import {
  CONTENT_KINDS,
  type ContentIds,
  type ContentInput,
  type Graph,
  type GraphInput,
  type TechInput,
  type TechNode,
} from './types';

/** 関連 Tech として表示する上限。多すぎると関連の強さが伝わらなくなるため絞る */
const RELATED_LIMIT = 10;

const emptyIds = (): ContentIds => ({ works: [], notes: [], career: [], activity: [] });

/**
 * コンテンツを一意に識別するキー。
 * id は種類ごとに独立しているため（Works と Notes に同じ id がありうる）、種類と組み合わせる
 */
const contentKey = (content: Pick<ContentInput, 'kind' | 'id'>) => `${content.kind}:${content.id}`;

/**
 * parent の循環参照を探す。
 *
 * 各 Tech から parent を辿り、同じ Tech に戻ってきたら循環とみなす。
 * 見つかった場合は、循環の始点から始点に戻るまでの id の並びを返す（例：a → b → a）。
 * 循環がなければ undefined を返す。
 *
 * スキーマ（reference）では存在しない parent は弾けるが、循環までは検出できないため、ここで確認する。
 */
export function findParentCycle(tech: TechInput[]): string[] | undefined {
  const parentOf = new Map(tech.map((t) => [t.id, t.parent]));

  for (const start of tech) {
    // start から辿った経路。ここに再び現れた Tech があれば、そこから先が循環している
    const path: string[] = [];
    let current: string | undefined = start.id;

    while (current !== undefined) {
      const index = path.indexOf(current);
      if (index !== -1) return [...path.slice(index), current];
      path.push(current);
      current = parentOf.get(current);
    }
  }
  return undefined;
}

/**
 * Tech の上位（祖先）と下位（子孫）をすべて集める。
 *
 * 設計上は1階層のみを想定しているが、将来2階層以上を許しても集計が壊れないよう、
 * 親子を最後まで辿る。呼び出し前に循環がないことを確認しておく必要がある（無限ループになるため）。
 */
function collectRelatives(
  id: string,
  parentOf: Map<string, string | undefined>,
  childrenOf: Map<string, string[]>,
) {
  const ancestors: string[] = [];
  for (let p = parentOf.get(id); p !== undefined; p = parentOf.get(p)) ancestors.push(p);

  // 子の子まで含めて集める（深さ優先）
  const descendants: string[] = [];
  const stack = [...(childrenOf.get(id) ?? [])];
  while (stack.length > 0) {
    const child = stack.pop()!;
    descendants.push(child);
    stack.push(...(childrenOf.get(child) ?? []));
  }
  return { ancestors, descendants };
}

/**
 * Engineering Graph を組み立てる。
 *
 * 1. parent の循環参照を検証する（あればビルドを止める）
 * 2. Tech ごとに、直接付与されたコンテンツを種類別に集める（direct）
 * 3. 下位 Tech の実績を含めて集計する（total）
 * 4. 同じコンテンツで併用されている Tech を数える（related）
 * 5. どのコンテンツからも参照されない Tech を挙げる（unused）
 *
 * contents の Tech は tech.yml に定義済みであることを前提とする（スキーマで検証済みのため）。
 */
export function buildGraph({ tech, contents }: GraphInput): Graph {
  // 1. 循環があると以降の親子の辿りが終わらないため、最初に確認する
  const cycle = findParentCycle(tech);
  if (cycle) {
    throw new Error(`tech.yml の parent が循環しています：${cycle.join(' → ')}`);
  }

  // 同数のときの並び順に使う（tech.yml の記述順）
  const order = new Map(tech.map((t, i) => [t.id, i]));

  // tech.yml には parent（子 → 親）しか書かないため、親 → 子の対応をここで作る
  const parentOf = new Map(tech.map((t) => [t.id, t.parent]));
  const childrenOf = new Map<string, string[]>(tech.map((t) => [t.id, []]));
  for (const t of tech) {
    if (t.parent !== undefined) childrenOf.get(t.parent)?.push(t.id);
  }

  // 2. 逆引き。同じコンテンツに同じ Tech が重複して書かれていても1件として数える
  const techOfContent = new Map<string, Set<string>>(); // 関連 Tech の算出で使う
  const direct = new Map<string, ContentIds>(tech.map((t) => [t.id, emptyIds()]));
  for (const content of contents) {
    const unique = new Set(content.tech);
    techOfContent.set(contentKey(content), unique);
    for (const id of unique) direct.get(id)?.[content.kind].push(content.id);
  }

  const nodes = new Map<string, TechNode>();
  for (const t of tech) {
    const { ancestors, descendants } = collectRelatives(t.id, parentOf, childrenOf);

    // 3. 自身と下位 Tech の実績をまとめる。
    //    上位と下位の両方が付いたコンテンツ（例：AWS と Lambda）を2件と数えないよう、重複を除く
    const total = emptyIds();
    for (const kind of CONTENT_KINDS) {
      const ids = [t.id, ...descendants].flatMap((id) => direct.get(id)![kind]);
      total[kind] = [...new Set(ids)];
    }

    // 4. 関連 Tech。下位 Tech の実績も含めたコンテンツで、一緒に使われた Tech を数える。
    //    自身・上位・下位は除く（例：AWS の関連に Lambda が常に出るのは情報にならないため）
    const excluded = new Set([t.id, ...ancestors, ...descendants]);
    const counts = new Map<string, number>();
    for (const kind of CONTENT_KINDS) {
      for (const id of total[kind]) {
        for (const other of techOfContent.get(contentKey({ kind, id })) ?? []) {
          if (!excluded.has(other)) counts.set(other, (counts.get(other) ?? 0) + 1);
        }
      }
    }
    // 回数の多い順。同数のときは tech.yml の順にして、ビルドごとに並びが変わらないようにする
    const related = [...counts.entries()]
      .sort(([a, countA], [b, countB]) => countB - countA || order.get(a)! - order.get(b)!)
      .slice(0, RELATED_LIMIT)
      .map(([id]) => id);

    nodes.set(t.id, {
      id: t.id,
      name: t.name,
      category: t.category,
      parent: t.parent,
      children: childrenOf.get(t.id)!,
      direct: direct.get(t.id)!,
      total,
      related,
    });
  }

  // 5. 直接の実績がない Tech。下位 Tech の実績だけがある上位 Tech も含む
  //    （上位 Tech を直接使ったコンテンツがないことに気づけるように）
  const unused = tech
    .map((t) => t.id)
    .filter((id) => CONTENT_KINDS.every((kind) => direct.get(id)![kind].length === 0));

  return { tech: nodes, unused };
}

/** 下位 Tech の実績を含めた、全種類の合計件数。Tech 一覧の並び順に使う */
export function totalCount(node: TechNode): number {
  return CONTENT_KINDS.reduce((sum, kind) => sum + node.total[kind].length, 0);
}

/**
 * 実績（下位 Tech を含む）が1件以上あるか。実績のない Tech は一覧に出さず、詳細ページも作らない
 * （tech.yml に定義しただけで、まだ使っていない Tech が「実績 0」として並ぶのを避けるため）。
 * Tech 詳細へのリンクを張るか・Home の Tech の衛星の数にも使うため、条件はここだけで決める
 */
export function hasRecords(node: TechNode): boolean {
  return totalCount(node) > 0;
}

/**
 * Tech 一覧の表示用に、ジャンルごとに区切って並べる。
 *
 * - ジャンルは categoryIds の順（tech-categories.yml の記述順）に並べる
 * - ジャンル内は実績の多い順。同数のときは tech.yml の順
 * - Tech が1件もないジャンルも空の配列として返す（表示するかは呼び出し側で決める）
 */
export function groupByCategory(graph: Graph, categoryIds: string[]) {
  // graph.tech は tech.yml の順に並んでいるため、その位置を同数時の並び順に使う
  const nodes = [...graph.tech.values()];
  const order = new Map(nodes.map((node, i) => [node.id, i]));

  return categoryIds.map((category) => ({
    category,
    tech: nodes
      .filter((node) => node.category === category)
      .sort((a, b) => totalCount(b) - totalCount(a) || order.get(a.id)! - order.get(b.id)!),
  }));
}
