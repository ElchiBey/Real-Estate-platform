import {
  CODE_CHAIN_NOT_ADDED,
  CODE_REQUEST_ALREADY_PENDING,
  CODE_USER_REJECTED,
} from "@/constants";
import { BaseError, UserRejectedRequestError } from "viem";

/**
 * Classifying wallet errors for display.
 *
 * Wallet failures arrive in two shapes: viem's typed error classes, and raw
 * EIP-1193 provider objects carrying a numeric `code`. viem also nests the
 * original error under `cause`, sometimes more than one level deep, so a plain
 * `error.code` check misses most real rejections. Everything here handles both.
 */

/** EIP-1193 / MetaMask error codes we react to specifically. */

// Walk the `cause` chain looking for a numeric EIP-1193 error code.
function findProviderCode(error: unknown, depth = 0): number | undefined {
  if (depth > 5 || typeof error !== "object" || error === null)
    return undefined;

  const candidate = error as { code?: unknown; cause?: unknown };
  if (typeof candidate.code === "number") return candidate.code;

  return findProviderCode(candidate.cause, depth + 1);
}

// The user clicked "Reject" in their wallet. Not an error worth alarming them about.
export function isUserRejection(error: unknown): boolean {
  if (
    error instanceof BaseError &&
    error.walk((e) => e instanceof UserRejectedRequestError)
  ) {
    return true;
  }
  return findProviderCode(error) === CODE_USER_REJECTED;
}

// The wallet does not know this network and refused to add it.
export function isChainNotAdded(error: unknown): boolean {
  return findProviderCode(error) === CODE_CHAIN_NOT_ADDED;
}

// A previous request is still open — MetaMask's popup is usually already waiting.
export function isRequestAlreadyPending(error: unknown): boolean {
  return findProviderCode(error) === CODE_REQUEST_ALREADY_PENDING;
}

/**
 * Returns `null` for user rejections: the user knows they just cancelled, and a
 * red error toast for a deliberate action reads as though something broke.
 * Callers should treat `null` as "say nothing, just return to the previous state".
 */
export function getWalletErrorMessage(
  error: unknown,
  fallback: string,
): string | null {
  if (isUserRejection(error)) return null;

  if (isChainNotAdded(error)) {
    return "Your wallet does not have this network yet. Add Polygon Amoy in your wallet, then try again.";
  }

  if (isRequestAlreadyPending(error)) {
    return "Your wallet already has a pending request. Open it to continue.";
  }

  return fallback;
}
