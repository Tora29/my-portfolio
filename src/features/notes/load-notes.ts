/**
 * 記事一覧・記事詳細に表示するデータの組み立て（.users/requirements/screens.md §5.7・§5.8）
 *
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import { getCollection, render, type CollectionEntry } from 'astro:content';
import { toDateString } from '@/lib/format-date';
import { findLink, loadProfile } from '@/lib/load-profile';
import { loadTechTags } from '@/lib/load-tech-tags';
import type { TechTagList } from '@/lib/tech-tags';

type Note = CollectionEntry<'notes'>;

export interface NoteListItem {
  id: string;
  href: string;
  title: string;
  date: string;
  category: string;
  tags: TechTagList;
}

export interface NotesPage {
  notes: NoteListItem[];
  /** Zenn のプロフィールの URL。profile.yml の links に Zenn がなければ undefined（案内を出さない） */
  zenn?: string;
}

export interface NoteDetail extends NoteListItem {
  summary: string;
  /** 大きく改訂した日。なければ undefined */
  updated?: string;
  Content: Awaited<ReturnType<typeof render>>['Content'];
  /** 記事の works で明示的に関連付けた作品 */
  relatedWorks: { href: string; title: string; summary: string }[];
}

async function toListItem(note: Note): Promise<NoteListItem> {
  return {
    id: note.id,
    href: `/notes/${note.id}`,
    title: note.data.title,
    date: toDateString(note.data.date),
    category: note.data.category,
    tags: await loadTechTags(note.data.tags),
  };
}

/** 新しい順。同じ日付の記事はタイトル順（ビルドごとに並びが変わらないように） */
const byDate = (a: Note, b: Note) =>
  b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title, 'ja');

/**
 * 記事一覧：すべての記事を新しい順に返す。
 * 技術記事は Zenn に書くため、一覧の末尾に Zenn への案内を出す（ここに無い記事を探しに来た人が行き止まりにならないように）
 */
export async function loadNotesPage(): Promise<NotesPage> {
  const [notes, profile] = await Promise.all([getCollection('notes'), loadProfile()]);
  return {
    notes: await Promise.all(notes.toSorted(byDate).map(toListItem)),
    zenn: findLink(profile.links, 'zenn.dev'),
  };
}

/** 記事詳細：すべての記事について、本文と関連する作品を返す */
export async function loadNoteDetails(): Promise<NoteDetail[]> {
  const [notes, works] = await Promise.all([getCollection('notes'), getCollection('works')]);
  const workById = new Map(works.map((e) => [e.id, e]));

  return Promise.all(
    notes.map(async (note) => ({
      ...(await toListItem(note)),
      summary: note.data.summary,
      updated: note.data.updated && toDateString(note.data.updated),
      Content: (await render(note)).Content,
      // 存在しない作品への参照はスキーマ（reference）でビルドエラーになる
      relatedWorks: note.data.works.map((ref) => {
        const work = workById.get(ref.id)!;
        return { href: `/works/${work.id}`, title: work.data.title, summary: work.data.summary };
      }),
    })),
  );
}
