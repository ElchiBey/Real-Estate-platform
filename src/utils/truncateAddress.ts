/**
 * Shorten a wallet address for display.
 *
 * Written rather than using RainbowKit's `account.displayName`, which
 * substitutes an ENS name when one exists and so would not reliably produce the
 * `0x1234...5678` shape.
 *
 * @param address  Full hex address, e.g. "0x1234567890abcdef1234567890abcdef12345678"
 * @param leading  Hex characters to keep after the "0x" prefix
 * @param trailing Hex characters to keep at the end
 *
 * @example
 * truncateAddress('0x1234567890abcdef1234567890abcdef12345678') // "0x1234...5678"
 */
export function truncateAddress(
  address: string,
  leading = 4,
  trailing = 4,
): string {
  if (!address) return "";

  if (address.length <= 2 + leading + trailing) return address;

  return `${address.slice(0, 2 + leading)}...${address.slice(-trailing)}`;
}
