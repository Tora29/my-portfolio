import { describe, expect, it } from 'vitest';
import { assignTech } from '../tech';

const known = new Set(['typescript', 'astro', 'aws']);

describe('assignTech', () => {
  it('tech ラベルがあれば、ラベルの Tech を使う', () => {
    expect(assignTech(['tech:aws', 'enhancement'], ['typescript'], known)).toEqual({
      tech: ['aws'],
      techSource: 'label',
      unknown: [],
    });
  });

  it('tech ラベルがなければ、作品の Tech を引き継ぐ', () => {
    expect(assignTech(['enhancement'], ['typescript', 'astro'], known)).toEqual({
      tech: ['typescript', 'astro'],
      techSource: 'work',
      unknown: [],
    });
  });

  it('tech.yml にない id のラベルは無視して報告する', () => {
    expect(assignTech(['tech:aws', 'tech:unknown'], ['typescript'], known)).toEqual({
      tech: ['aws'],
      techSource: 'label',
      unknown: ['unknown'],
    });
  });

  it('有効なラベルが1つもなければ作品の Tech を使う', () => {
    expect(assignTech(['tech:unknown'], ['typescript'], known).techSource).toBe('work');
  });
});
