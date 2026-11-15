/** Amounts are whole RWF (no decimals) per Product.java. */
export function formatMoney(amount: number): string {
  return `${amount.toLocaleString()} RWF`;
}
