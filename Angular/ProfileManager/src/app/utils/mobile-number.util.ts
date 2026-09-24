/** The one format persisted to Firestore: "+91" followed by 10 digits starting 6-9. */
export const CANONICAL_MOBILE_NUMBER_PATTERN = /^\+91[6-9]\d{9}$/;

const NATIONAL_MOBILE_NUMBER_PATTERN = /^[6-9]\d{9}$/;

/**
 * Keeps only the digits. Drops spaces, hyphens, dots, parentheses, the "+" sign and the
 * invisible Unicode direction marks that phone apps embed when a number is copied.
 */
export function mobileNumberDigits(value: string | null | undefined): string {
  return (value ?? '').replace(/\D/g, '');
}

/**
 * Converts any reasonable way of writing an Indian mobile number into the canonical form,
 * or returns `null` when the input cannot be one.
 *
 * Accepted inputs (separators anywhere are ignored):
 * - `98765 43210`          10 digits
 * - `098765 43210`         0 + 10 digits (trunk prefix)
 * - `91 98765 43210`       91 + 10 digits
 * - `+91 98765-43210`      +91 + 10 digits
 */
export function toCanonicalMobileNumber(value: string | null | undefined): string | null {
  const digits = mobileNumberDigits(value);
  const national =
    digits.length === 12 && digits.startsWith('91')
      ? digits.slice(2)
      : digits.length === 11 && digits.startsWith('0')
        ? digits.slice(1)
        : digits;
  return NATIONAL_MOBILE_NUMBER_PATTERN.test(national) ? `+91${national}` : null;
}
