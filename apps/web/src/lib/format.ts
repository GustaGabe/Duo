import type { IsoDate, IsoMonth } from '@duo/shared';

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

const BRL_COMPACT = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const NUMBER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `648210` -> `"R$ 6.482,10"`. Always takes cents. */
export function formatBRL(cents: number): string {
  return BRL.format(cents / 100);
}

/** `648210` -> `"R$ 6.482"`. For cards where the cents are noise. */
export function formatBRLCompact(cents: number): string {
  return BRL_COMPACT.format(cents / 100);
}

/** `648210` -> `"6.482,10"` — no symbol, for when "R$" is its own element. */
export function formatAmount(cents: number): string {
  return NUMBER.format(cents / 100);
}

/**
 * Signed value, as it appears in the entry list: `− R$ 182,00` / `+ R$ 5.800,00`.
 * Uses the typographic minus (U+2212), which lines up with the digits.
 */
export function formatSigned(cents: number, kind: 'expense' | 'income'): string {
  return `${kind === 'income' ? '+' : '−'} ${formatBRL(Math.abs(cents))}`;
}

/** Turns what was typed on the numeric keypad (`"8250"`) into cents. */
export function digitsToCents(digits: string): number {
  const parsed = Number.parseInt(digits.replace(/\D/g, '') || '0', 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** `"Ana Ribeiro"` -> `"A"`. The design uses a single letter in avatars. */
export function initials(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?';
}

const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** `"2026-09"` -> `"Setembro 2026"`. */
export function formatMonthLong(month: IsoMonth): string {
  const [year, m] = month.split('-');
  const name = MONTHS[Number(m) - 1] ?? '';
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${year}`;
}

/** `"2026-09"` -> `"setembro"`. */
export function formatMonthName(month: IsoMonth): string {
  return MONTHS[Number(month.split('-')[1]) - 1] ?? '';
}

/** `"2026-09-04"` -> `"04/09/2026"`. */
export function formatDate(date: IsoDate): string {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Short relative day used in list metadata: "ontem", "sábado". Compared against `today` so the
 * mock data stays stable.
 */
export function formatRelativeDay(date: IsoDate, today: IsoDate): string {
  const diff = Math.round(
    (Date.parse(`${today}T00:00:00`) - Date.parse(`${date}T00:00:00`)) / 86_400_000,
  );
  if (diff <= 0) return 'hoje';
  if (diff === 1) return 'ontem';
  if (diff < 7) {
    return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' }).format(
      new Date(`${date}T00:00:00Z`),
    );
  }
  return formatDate(date);
}

/** Whole percentage clamped to 0–100, ready to be used as a `width`. */
export function percentWidth(value: number): string {
  return `${Math.max(0, Math.min(100, Math.round(value)))}%`;
}
