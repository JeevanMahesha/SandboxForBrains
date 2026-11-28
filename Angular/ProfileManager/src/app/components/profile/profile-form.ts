import { computed, effect, signal, untracked } from '@angular/core';
import {
  disabled,
  form,
  min,
  patternError,
  readonly,
  required,
  validate,
} from '@angular/forms/signals';
import {
  DISTRICT_LIST,
  PROFILE_STATUS,
  PROFILE_STATUS_STYLES,
  STAR_SCORES,
  StarKey,
  ZODIAC_LIST,
  ZodiacKey,
} from '../../constant/common.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
import type { DuplicateOwner } from '../../services/profiles.service';
import {
  CANONICAL_MOBILE_NUMBER_PATTERN,
  toCanonicalMobileNumber,
} from '../../utils/mobile-number.util';

export interface ProfileFormOptions {
  /** View mode shows saved data as-is: the form is disabled and nothing is derived. */
  isView?: () => boolean;
  /** Persists the (already canonicalised) profile. Called from the form submission. */
  save: (profile: ProfileDetail) => Promise<void>;
  /** Finds other profiles that already use an ID or number (`ProfilesService.findDuplicates`). */
  findDuplicates?: (criteria: {
    matrimonyId?: string;
    mobileNumber?: string;
  }) => Promise<{ matrimonyId?: DuplicateOwner; mobileNumber?: DuplicateOwner }>;
  /** The stored profile when editing: only an ID or number changed from it is checked. */
  original?: () => ProfileDetail | null | undefined;
  /** Called when a check finds a duplicate, so the host can reveal the offending field. */
  onDuplicate?: () => void;
}

/** A duplicate found by `checkDuplicates`, tied to the exact value it was found for. */
interface KnownDuplicate {
  value: string;
  message: string;
}

/** Status a brand-new profile starts with. */
export const DEFAULT_PROFILE_STATUS = 'NEW' satisfies keyof typeof PROFILE_STATUS;

export const blankProfile = (): ProfileDetail => ({
  name: '',
  mobileNumber: '+91',
  zodiacSign: null,
  star: null,
  age: null,
  starMatchScore: null,
  state: null,
  city: null,
  // A new profile starts as New; loaded profiles (edit/view) overwrite this with their own value.
  profileStatusId: DEFAULT_PROFILE_STATUS,
  matrimonyId: '',
  comments: [],
});

/**
 * Signal form shared by the edit drawer and the create wizard: model, validators,
 * derived star score / stale star / stale city handling, comments and submission.
 * Must be called in an injection context (it registers effects).
 */
export function createProfileForm(options: ProfileFormOptions) {
  const isView = options.isView ?? (() => false);
  const profileDetail = signal<ProfileDetail>(blankProfile());
  const newComment = signal<string>('');
  // Duplicates found by the last check. Each is tied to the value it was found for, so the error
  // goes away by itself as soon as the user edits that field.
  const knownDuplicates = signal<{ matrimonyId?: KnownDuplicate; mobileNumber?: KnownDuplicate }>(
    {},
  );

  const profileDetailForm = form(
    profileDetail,
    (profileForm) => {
      required(profileForm.name, { message: 'Name is required' });
      required(profileForm.mobileNumber, { message: 'Mobile number is required' });
      required(profileForm.zodiacSign, { message: 'Zodiac sign is required' });
      required(profileForm.age, { message: 'Age is required' });
      // Star is optional. The score is derived from it, so it is only required once a star is set.
      required(profileForm.starMatchScore, {
        when: ({ valueOf: readValue }) => !!readValue(profileForm.star),
        message: 'Star match score is required',
      });
      required(profileForm.state, { message: 'State is required' });
      required(profileForm.city, { message: 'City is required' });
      required(profileForm.profileStatusId, { message: 'Profile status is required' });
      required(profileForm.matrimonyId, { message: 'Matrimony ID is required' });
      min(profileForm.age, 18, { message: 'Age must be at least 18' });
      // Accept any spacing / prefix the user types ("98 76 5 43 21 0", "+91 98765 43210", "0987...").
      // A truly empty field is left to the required() rule above; anything else (including
      // input with no digits such as "N/A" or spaces) must be a valid number.
      validate(profileForm.mobileNumber, ({ value }) => {
        const raw = value();
        return !raw || toCanonicalMobileNumber(raw)
          ? null
          : patternError(CANONICAL_MOBILE_NUMBER_PATTERN, {
              message: 'Invalid mobile number (e.g., 98765 43210 or +91 98765 43210)',
            });
      });
      validate(profileForm.matrimonyId, ({ value }) => {
        const known = knownDuplicates().matrimonyId;
        return known && known.value === value().trim()
          ? { kind: 'duplicate', message: known.message }
          : null;
      });
      validate(profileForm.mobileNumber, ({ value }) => {
        const known = knownDuplicates().mobileNumber;
        return known && known.value === (toCanonicalMobileNumber(value()) ?? value())
          ? { kind: 'duplicate', message: known.message }
          : null;
      });
      readonly(profileForm.starMatchScore);
      disabled(profileForm, { when: () => isView() });
      disabled(profileForm.star, {
        when: ({ valueOf: readValue }) => !readValue(profileForm.zodiacSign),
      });
      disabled(profileForm.city, {
        when: ({ valueOf: readValue }) => !readValue(profileForm.state),
      });
    },
    {
      submission: {
        action: async (formRef) => {
          // Safety net: someone may have taken the ID or number since the wizard's step 1 check.
          if (!(await checkDuplicates())) {
            return;
          }
          // Flush a comment the user typed but didn't explicitly add, so it isn't lost on save.
          if (newComment().trim()) {
            addComment();
          }
          // Persist the canonical "+91XXXXXXXXXX" form regardless of how the user typed it.
          // Validation guarantees a canonical form exists here; the fallback only satisfies the type.
          const rawMobileNumber = formRef().value().mobileNumber;
          // Trim name and matrimonyId: search trims its input and matches matrimonyId exactly,
          // so a stored "M123 " could never be found.
          const profileData: ProfileDetail = {
            ...formRef().value(),
            name: formRef().value().name.trim(),
            matrimonyId: formRef().value().matrimonyId.trim(),
            mobileNumber: toCanonicalMobileNumber(rawMobileNumber) ?? rawMobileNumber,
          };
          return options.save(profileData);
        },
      },
    },
  );

  /**
   * Checks whether another profile already uses this ID or number, and marks the field invalid
   * with a message naming that profile. Resolves to false when one is taken. Editing checks only
   * a field changed from the stored profile, so a legacy profile that already shares a number
   * can still be edited. Does nothing when the host gave no `findDuplicates`.
   */
  async function checkDuplicates(): Promise<boolean> {
    if (!options.findDuplicates) {
      return true;
    }
    const current = profileDetail();
    const original = options.original?.();
    const matrimonyId = current.matrimonyId.trim();
    const mobileNumber = toCanonicalMobileNumber(current.mobileNumber);
    const idChanged = !original || matrimonyId !== (original.matrimonyId ?? '').trim();
    const mobileChanged =
      !original ||
      mobileNumber !== (toCanonicalMobileNumber(original.mobileNumber) ?? original.mobileNumber);

    const found = await options.findDuplicates({
      matrimonyId: matrimonyId && idChanged ? matrimonyId : undefined,
      mobileNumber: mobileNumber && mobileChanged ? mobileNumber : undefined,
    });
    const ownerName = (owner: DuplicateOwner) => owner.name || 'another profile';
    knownDuplicates.set({
      matrimonyId: found.matrimonyId
        ? {
            value: matrimonyId,
            message: `Matrimony ID ${matrimonyId} already belongs to ${ownerName(found.matrimonyId)}`,
          }
        : undefined,
      mobileNumber:
        found.mobileNumber && mobileNumber
          ? {
              value: mobileNumber,
              message: `This mobile number already belongs to ${ownerName(found.mobileNumber)} (${found.mobileNumber.matrimonyId})`,
            }
          : undefined,
    });
    const taken = !!found.matrimonyId || !!found.mobileNumber;
    if (taken) {
      options.onDuplicate?.();
    }
    return !taken;
  }

  const starList = computed(() => {
    const zodiac = profileDetailForm.zodiacSign().value();
    return zodiac ? ((ZODIAC_LIST[zodiac as ZodiacKey]?.stars as readonly string[]) ?? []) : [];
  });

  const cityList = computed(
    () => DISTRICT_LIST[profileDetail().state as keyof typeof DISTRICT_LIST] as unknown as string[],
  );

  const profileStatusLabel = computed(() => {
    const id = profileDetailForm.profileStatusId().value() as keyof typeof PROFILE_STATUS | null;
    return id ? PROFILE_STATUS[id] : null;
  });

  const profileStatusColor = computed(() => {
    const id = profileDetailForm.profileStatusId().value() as
      keyof typeof PROFILE_STATUS_STYLES | null;
    return id ? PROFILE_STATUS_STYLES[id].badge : null;
  });

  const zodiacLabel = computed(() => {
    const zodiac = ZODIAC_LIST[profileDetailForm.zodiacSign().value() as ZodiacKey];
    return zodiac ? `${zodiac.tanglish} (${zodiac.english})` : null;
  });

  const starLabel = computed(() => {
    const star = profileDetailForm.star().value();
    if (!star) return null;
    const score = STAR_SCORES[star as StarKey];
    return score === undefined ? star : `${star} (${score})`;
  });

  const locationLabel = computed(() =>
    [profileDetailForm.city().value(), profileDetailForm.state().value()]
      .filter(Boolean)
      .join(', '),
  );

  function addComment(): void {
    const value = newComment().trim();
    if (!value) {
      return;
    }
    const currentComments = profileDetailForm.comments().value();
    profileDetailForm.comments().value.set([
      ...currentComments,
      {
        value,
        createDateAndTime: new Date(),
      },
    ]);
    newComment.set('');
  }

  function deleteComment(comment: Comment): void {
    const currentComments = profileDetailForm.comments().value();
    // Remove exactly the clicked note (same object), not every note sharing its text or timestamp.
    profileDetailForm
      .comments()
      .value.set(currentComments.filter((eachComment) => eachComment !== comment));
  }

  /** Back to a blank, untouched form (also clears touched/dirty so no stale errors show). */
  function resetForm(): void {
    newComment.set('');
    knownDuplicates.set({});
    profileDetailForm().reset({ ...blankProfile(), comments: [] });
  }

  // Derive starMatchScore from the selected star; clear it when no star is selected.
  // Skipped in view mode — saved data is displayed as-is.
  effect(() => {
    const star = profileDetailForm.star().value();
    untracked(() => {
      if (isView()) return;
      if (star && star in STAR_SCORES) {
        profileDetailForm.starMatchScore().value.set(STAR_SCORES[star as StarKey]);
      } else {
        profileDetailForm.starMatchScore().value.set(null);
      }
    });
  });

  // Clear a stale star when the zodiac changes to one that no longer lists it.
  effect(() => {
    profileDetailForm.zodiacSign().value();
    untracked(() => {
      if (isView()) return;
      const currentStar = profileDetailForm.star().value();
      if (currentStar && !starList().includes(currentStar)) {
        profileDetailForm.star().value.set(null);
      }
    });
  });

  // Clear a stale city when the state changes to one that no longer lists it.
  effect(() => {
    profileDetailForm.state().value();
    untracked(() => {
      const currentCity = profileDetailForm.city().value();
      if (currentCity && !(cityList() ?? []).includes(currentCity)) {
        profileDetailForm.city().value.set(null);
      }
    });
  });

  return {
    profileDetail,
    profileDetailForm,
    newComment,
    addComment,
    deleteComment,
    checkDuplicates,
    resetForm,
    profileStatusLabel,
    profileStatusColor,
    zodiacLabel,
    starLabel,
    locationLabel,
  };
}
