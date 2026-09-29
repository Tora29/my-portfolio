import { describe, expect, it } from 'vitest';
import { classifyPullRequest } from '../classify';
import type { PullRequest } from '../types';

const pr = (overrides: Partial<PullRequest> = {}): PullRequest => ({
  number: 1,
  title: '',
  body: null,
  mergedAt: '2026-09-24T01:00:00Z',
  labels: [],
  byBot: false,
  headRef: 'feat/x',
  url: 'https://github.com/o/r/pull/1',
  ...overrides,
});

describe('classifyPullRequest', () => {
  it.each([
    ['feat', 'feature'],
    ['fix', 'fix'],
    ['perf', 'improvement'],
    ['refactor', 'improvement'],
    ['docs', 'docs'],
  ])('%s は %s として載せる', (prefix, type) => {
    expect(classifyPullRequest(pr(), prefix)).toEqual({ type });
  });

  it.each(['chore', 'ci', 'build', 'test', 'style'])('%s は載せない', (prefix) => {
    expect(classifyPullRequest(pr(), prefix)).toHaveProperty('skip');
  });

  it('接頭辞がない・未知の接頭辞の PR は pr として載せる', () => {
    expect(classifyPullRequest(pr(), undefined)).toEqual({ type: 'pr' });
    expect(classifyPullRequest(pr(), 'feature')).toEqual({ type: 'pr' });
  });

  it('マージされていない PR は載せない', () => {
    expect(classifyPullRequest(pr({ mergedAt: null }), 'feat')).toHaveProperty('skip');
  });

  it('Bot が作成した PR は載せない', () => {
    expect(classifyPullRequest(pr({ byBot: true }), 'feat')).toHaveProperty('skip');
  });

  it('activity:skip ラベルが付いた PR は、種類に関係なく載せない', () => {
    expect(classifyPullRequest(pr({ labels: ['activity:skip'] }), 'feat')).toHaveProperty('skip');
  });

  it('確認用 PR（bot/activity）は載せない', () => {
    expect(classifyPullRequest(pr({ headRef: 'bot/activity' }), undefined)).toHaveProperty('skip');
  });
});
