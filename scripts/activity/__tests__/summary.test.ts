import { describe, expect, it } from 'vitest';
import { SUMMARY_MAX_LENGTH, TEMPLATE_PLACEHOLDER, extractSummary } from '../summary';

describe('extractSummary', () => {
  it('最初の見出しより前の、最初の段落を要約にする', () => {
    const body =
      'Tech 一覧をジャンルで区切った。\n閲覧者が探しやすくなる。\n\n2つ目の段落\n\n## 変更内容\n- …';
    expect(extractSummary(body, '見出し')).toBe(
      'Tech 一覧をジャンルで区切った。 閲覧者が探しやすくなる。',
    );
  });

  it('本文が空なら見出しを使う', () => {
    expect(extractSummary(null, '見出し')).toBe('見出し');
    expect(extractSummary('', '見出し')).toBe('見出し');
  });

  it('見出しから始まる本文は、要約がないものとして見出しを使う', () => {
    expect(extractSummary('## 変更内容\n\n説明', '見出し')).toBe('見出し');
  });

  it('HTML コメントを除き、テンプレートの定型文のままなら見出しを使う', () => {
    const body = `<!-- 最初の段落が要約になる -->\n${TEMPLATE_PLACEHOLDER}\n\n## 変更内容\n- `;
    expect(extractSummary(body, '見出し')).toBe('見出し');
  });

  it('署名（Co-Authored-By などの trailer・生成ツールの署名）だけの段落は要約にしない', () => {
    const trailers =
      'Co-Authored-By: Claude <noreply@anthropic.com>\nClaude-Session: https://claude.ai/code/session_x';
    expect(extractSummary(trailers, '見出し')).toBe('見出し');
    expect(extractSummary(`🤖 Generated with [Claude Code](https://claude.com)`, '見出し')).toBe(
      '見出し',
    );
    expect(extractSummary(`${trailers}\n\n本文の要約。`, '見出し')).toBe('本文の要約。');
  });

  it('「注意: …」のように、署名でない行が混ざる段落は要約にする', () => {
    expect(extractSummary('注意: 日本語の段落。\n2行目', '見出し')).toBe(
      '注意: 日本語の段落。 2行目',
    );
  });

  it('箇条書き・チェックリスト・引用は要約にしない', () => {
    const body = '- [ ] 確認\n- 項目\n\n> 引用\n\n本文の段落';
    expect(extractSummary(body, '見出し')).toBe('本文の段落');
  });

  it('リンクは文字だけを残し、URL と画像は除く', () => {
    const body =
      '[設計書](https://example.com/doc) に沿って実装した ![図](a.png) https://example.com';
    expect(extractSummary(body, '見出し')).toBe('設計書 に沿って実装した');
  });

  it('コードブロックの中の # を見出しとみなさない', () => {
    const body = '```sh\n# コメント\n```\n\n説明の段落';
    expect(extractSummary(body, '見出し')).toBe('説明の段落');
  });

  it(`${SUMMARY_MAX_LENGTH} 文字を超える分は切り、… を付ける`, () => {
    const summary = extractSummary('あ'.repeat(300), '見出し');
    expect([...summary]).toHaveLength(SUMMARY_MAX_LENGTH);
    expect(summary.endsWith('…')).toBe(true);
  });
});
