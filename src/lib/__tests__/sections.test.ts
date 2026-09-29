import { describe, expect, it } from 'vitest';
import { adjacentSections } from '../sections';

describe('adjacentSections', () => {
  it('タブ順で前後のセクションを返す', () => {
    const { prev, next } = adjacentSections('tech');
    expect(prev?.id).toBe('works');
    expect(next?.id).toBe('notes');
  });

  it('先頭のセクションには前がない', () => {
    expect(adjacentSections('about').prev).toBeUndefined();
    expect(adjacentSections('about').next?.id).toBe('career');
  });

  it('末尾のセクションには次がない', () => {
    expect(adjacentSections('activity').next).toBeUndefined();
  });
});
