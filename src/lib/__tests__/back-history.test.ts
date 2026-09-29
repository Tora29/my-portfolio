import { describe, expect, it } from 'vitest';
import { popEntry, pushEntry, resolveBack, type BackEntry } from '../back-history';

const aToB: BackEntry = { from: '/a', label: 'A', to: '/b' };
const bToC: BackEntry = { from: '/b', label: 'B', to: '/c' };

describe('resolveBack', () => {
  it('本文のリンクで来たページでは、移動元が戻り先になる', () => {
    expect(resolveBack([aToB], '/b')).toEqual({ stack: [aToB], back: aToB });
  });

  it('戻るボタンで戻ったページでは、さらにその前が戻り先になる', () => {
    const stack = popEntry([aToB, bToC]);
    expect(resolveBack(stack, '/b').back).toEqual(aToB);
  });

  it('ブラウザの戻るで戻ったページでは、出ていった記録を取り除く', () => {
    expect(resolveBack([aToB, bToC], '/b')).toEqual({ stack: [aToB], back: aToB });
  });

  it('記録と関係のないページを開いたら、記録を捨てて戻り先なしにする', () => {
    expect(resolveBack([aToB, bToC], '/x')).toEqual({ stack: [] });
  });

  it('記録がなければ戻り先なし', () => {
    expect(resolveBack([], '/a')).toEqual({ stack: [] });
  });
});

describe('pushEntry', () => {
  it('上限を超えたら古いものから捨てる', () => {
    let stack: BackEntry[] = [];
    for (let i = 0; i < 40; i++) stack = pushEntry(stack, { from: `/${i}`, label: '', to: '/' });
    expect(stack).toHaveLength(30);
    expect(stack[0].from).toBe('/10');
  });
});
