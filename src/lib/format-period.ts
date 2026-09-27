/**
 * 在籍期間の表示（例：2021 — 2023、2024 — Present）
 *
 * 期間は年単位で持つ（職歴の公開範囲のルール）。現職は end が null。
 */
export function formatPeriod(period: { start: number; end: number | null }): string {
  return `${period.start} — ${period.end ?? 'Present'}`;
}
