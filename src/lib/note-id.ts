/**
 * 記事のフォルダ名から id（URL）を決める
 *
 * 記事は content/notes/YYYY-MM-DD-<id>/ に置く。フォルダ名の先頭に公開日を付けるのは、
 * ディレクトリを見ただけで公開順に並び、いつ公開したかが分かるようにするため。
 * URL には日付を含めない（/notes/<id>）。公開済みの記事の URL を変えずに済むようにするため。
 *
 * content.config.ts の読み込み時（ビルド時）に使う。書き方：.claude/rules/content-authoring.md
 */
import { toDateString } from './format-date';

/** YYYY-MM-DD-<id>。id は英小文字・数字・ハイフンのみ（kebab-case） */
const NOTE_FOLDER = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/;

/**
 * フォルダ名から日付を除いた id を返す。
 *
 * 次の場合はエラーを投げ、ビルドを止める。
 * - フォルダ名が YYYY-MM-DD-<id> の形になっていない
 * - フォルダ名の日付と frontmatter の date が一致しない（どちらかだけ直して食い違うのを防ぐ）
 *
 * date は検証前の frontmatter の値を受け取る。YAML の日付は Date、引用符付きなら文字列になる。
 * date がない場合は照合しない（書き忘れはスキーマの検証で別にエラーになる）
 */
export function noteIdFromFolder(folder: string, date: unknown): string {
  const match = NOTE_FOLDER.exec(folder);
  if (!match) {
    throw new Error(
      `記事のフォルダ名は YYYY-MM-DD-<id> の形にする（content/notes/${folder}/）。例：2026-09-28-static-first-portfolio`,
    );
  }
  const [, folderDate, id] = match;

  if (date !== undefined) {
    const frontmatterDate = date instanceof Date ? toDateString(date) : String(date);
    if (frontmatterDate !== folderDate) {
      throw new Error(
        `記事のフォルダ名の日付（${folderDate}）と frontmatter の date（${frontmatterDate}）が一致しない（content/notes/${folder}/）`,
      );
    }
  }

  return id;
}
