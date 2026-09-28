/**
 * 確認用 PR の本文（.users/design/activity-pipeline.md §6.1）
 *
 * 今回追加した Activity を、公開される見出し・要約のまま一覧にする。
 * 直し方・除外の仕方もここに書き、確認する人がルールを見に行かなくて済むようにする
 */
import type { Activity } from './types.ts';

export function renderSummary(added: Activity[]): string {
  const rows = added.map(
    (a) =>
      `- **${a.date}** ${a.headline}（[${a.id}](${a.url})）\n  - 要約：${a.summary}\n  - Tech：${a.tech.join(', ') || 'なし'}`,
  );
  return `GitHub の開発活動から、ポートフォリオに載せる Activity を ${added.length} 件生成しました。

## 追加する Activity

${rows.join('\n')}

## 確認のしかた

- そのまま公開する：このPRをマージする（作成から7日たつと自動でマージされる）
- 要約・見出しを直す：このブランチの \`data/activity.json\` を編集する
- 載せない：\`data/activity-excluded.yml\` に id と理由を追加し、\`data/activity.json\` から削除する
- 公開を止める：\`hold\` ラベルを付ける
`;
}
