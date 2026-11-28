import { PROFILE_STATUS, ZODIAC_LIST } from '../../src/app/constant/common.const';

/**
 * The zodiac select lists its options as "<tanglish> (<english>)" (see zodiacToLabel in
 * profile-form-fields.ts). The expected label is derived from the same source data rather than
 * hard-coded, so a wording change to either name doesn't silently desync the specs.
 */
export const ARIES_LABEL = `${ZODIAC_LIST.aries.tanglish} (${ZODIAC_LIST.aries.english})`;

/** How many statuses the app offers (the inline status menu lists each one). */
export const PROFILE_STATUS_COUNT = Object.keys(PROFILE_STATUS).length;
