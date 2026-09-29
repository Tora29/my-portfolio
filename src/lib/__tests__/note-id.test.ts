import { describe, expect, it } from 'vitest';
import { noteIdFromFolder } from '../note-id';

describe('noteIdFromFolder', () => {
  it('フォルダ名の先頭の日付を除いて id にする', () => {
    expect(noteIdFromFolder('2026-09-28-static-first-portfolio', new Date('2026-09-28'))).toBe(
      'static-first-portfolio',
    );
  });

  it('date が文字列でも日付を照合する', () => {
    expect(noteIdFromFolder('2026-09-28-static-first-portfolio', '2026-09-28')).toBe(
      'static-first-portfolio',
    );
  });

  it('date がないときは照合せずに id を返す', () => {
    expect(noteIdFromFolder('2026-09-28-static-first-portfolio', undefined)).toBe(
      'static-first-portfolio',
    );
  });

  it('フォルダ名に日付がないときはエラーにする', () => {
    expect(() => noteIdFromFolder('static-first-portfolio', undefined)).toThrow('YYYY-MM-DD-<id>');
  });

  it('日付のあとに id がないときはエラーにする', () => {
    expect(() => noteIdFromFolder('2026-09-28', undefined)).toThrow('YYYY-MM-DD-<id>');
  });

  it('id に英小文字・数字・ハイフン以外が含まれるときはエラーにする', () => {
    expect(() => noteIdFromFolder('2026-09-28-Static_First', undefined)).toThrow('YYYY-MM-DD-<id>');
  });

  it('フォルダ名の日付と frontmatter の date が一致しないときはエラーにする', () => {
    expect(() =>
      noteIdFromFolder('2026-09-28-static-first-portfolio', new Date('2026-09-29')),
    ).toThrow('一致しない');
  });
});
