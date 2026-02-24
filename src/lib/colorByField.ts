/** Utilities for data-driven match-expression styling */

export interface CategoryEntry {
  value: string;   // actual field value (immutable key)
  color: string;   // hex color
  label: string;   // editable display label (defaults to value)
}

/** 15-color palette for automatic assignment */
export const DEFAULT_PALETTE = [
  '#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4',
  '#42d4f4', '#f032e6', '#bfef45', '#fabed4', '#469990',
  '#dcbeff', '#9A6324', '#800000', '#aaffc3', '#808000',
];

/** Parse a MapLibre match expression into structured categories */
export function parseMatchExpression(
  expr: unknown
): { field: string; categories: CategoryEntry[]; fallbackColor: string } | null {
  if (!Array.isArray(expr) || expr[0] !== 'match') return null;
  if (!Array.isArray(expr[1]) || expr[1][0] !== 'get' || typeof expr[1][1] !== 'string') return null;

  const field = expr[1][1];
  const categories: CategoryEntry[] = [];

  for (let i = 2; i < expr.length - 1; i += 2) {
    const value = String(expr[i]);
    const color = String(expr[i + 1]);
    categories.push({ value, color, label: value });
  }

  const fallbackColor = String(expr[expr.length - 1]);
  return { field, categories, fallbackColor };
}

/** Build a MapLibre match expression from structured categories */
export function buildMatchExpression(
  field: string,
  categories: CategoryEntry[],
  fallbackColor: string
): unknown[] {
  const expr: unknown[] = ['match', ['get', field]];
  for (const cat of categories) {
    expr.push(cat.value, cat.color);
  }
  expr.push(fallbackColor);
  return expr;
}

/** Assign colors to values, preserving existing entries where possible */
export function assignColors(
  values: string[],
  existing?: CategoryEntry[]
): CategoryEntry[] {
  const existingMap = new Map<string, CategoryEntry>();
  if (existing) {
    for (const e of existing) existingMap.set(e.value, e);
  }

  let paletteIdx = existing?.length ?? 0;
  return values.map((value) => {
    const prev = existingMap.get(value);
    if (prev) return prev;
    const color = DEFAULT_PALETTE[paletteIdx % DEFAULT_PALETTE.length];
    paletteIdx++;
    return { value, color, label: value };
  });
}
