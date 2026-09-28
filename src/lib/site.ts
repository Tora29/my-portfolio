/**
 * サイト全体で使う値
 */

/** サイト名。<title> の末尾に付ける（data/profile.yml の name と揃える） */
export const SITE_NAME = 'Tora29';

/** ページの <title>。ページ名がなければサイト名だけにする */
export const pageTitle = (...parts: string[]) => [...parts, SITE_NAME].join(' | ');
