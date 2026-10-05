/**
 * 記事一覧に表示するデータの組み立て（.users/requirements/screens.md §5.7）
 *
 * 記事（articles/）の本文は Zenn で公開しているため、サイトには詳細ページを作らず、一覧から Zenn の記事へリンクする。
 * コンポーネントには、ここで組み立てた表示用の値だけを渡す（コンポーネントで getCollection を呼ばない）。
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { toDateString } from '@/lib/format-date';
import { loadProfile } from '@/lib/load-profile';
import { loadTechTags } from '@/lib/load-tech-tags';
import { findLink } from '@/lib/profile-links';
import type { TechTagList } from '@/lib/tech-tags';
import { zennArticleUrl } from '@/lib/zenn';

type Note = CollectionEntry<'notes'>;

export interface NoteListItem {
  id: string;
  /** Zenn の記事の URL */
  href: string;
  title: string;
  date: string;
  tags: TechTagList;
}

export interface NotesPage {
  notes: NoteListItem[];
  /** Zenn のプロフィールの URL。profile.yml の links に Zenn がなければ undefined（案内を出さない） */
  zenn?: string;
}

async function toListItem(note: Note): Promise<NoteListItem> {
  return {
    id: note.id,
    href: zennArticleUrl(note.id),
    title: note.data.title,
    date: toDateString(note.data.date),
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
