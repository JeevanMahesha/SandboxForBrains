import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import {
  DISTRICT_LIST,
  NOT_SPECIFIED_LABEL,
  PROFILE_STATUS,
  PROFILE_STATUS_STYLES,
  STAR_SCORES,
  StarKey,
  ZODIAC_LIST,
  ZodiacKey,
} from '../../../constant/common.const';
import { ProfileDetail } from '../../../models/profile.model';

export type FieldGroup = 'contact' | 'astro' | 'age' | 'place';

@Component({
  selector: 'app-profile-form-fields',
  imports: [
    FormField,
    NgTemplateOutlet,
    KeyValuePipe,
    HlmInput,
    HlmSeparator,
    ...HlmFieldImports,
    ...HlmSelectImports,
  ],
  templateUrl: './profile-form-fields.html',
  host: { class: 'flex flex-col gap-4' },
})
export class ProfileFormFieldsComponent {
  readonly profileDetailForm = input.required<FieldTree<ProfileDetail>>();
  /** Limits which field groups render (default: all, as in the edit drawer). */
  readonly groups = input<readonly FieldGroup[] | null>(null);
  /** Hides the section headings and separators (the wizard supplies its own step headings). */
  readonly bare = input(false);
  readonly shows = (group: FieldGroup): boolean => this.groups()?.includes(group) ?? true;

  readonly NOT_SPECIFIED = NOT_SPECIFIED_LABEL;
  readonly PROFILE_STATUS_DATA = PROFILE_STATUS;
  readonly ZODIAC_SIGN_DATA = Object.entries(ZODIAC_LIST).map(([key, value]) => ({
    key,
    value: `${value.tanglish} (${value.english})`,
  }));
  readonly starList = computed(() => {
    const zodiac = this.profileDetailForm().zodiacSign().value();
    if (!zodiac) return [];
    return ((ZODIAC_LIST[zodiac as ZodiacKey]?.stars as readonly string[]) ?? []).map((star) => ({
      key: star,
      value: `${star} (${STAR_SCORES[star as StarKey]})`,
    }));
  });
  readonly starPlaceholder = computed(() =>
    this.profileDetailForm().zodiacSign().value()
      ? 'Select Star'
      : 'Select a zodiac to choose a star',
  );
  readonly STATE_LIST = DISTRICT_LIST ? Object.keys(DISTRICT_LIST) : [];

  readonly statusToLabel = (key: string): string =>
    PROFILE_STATUS[key as keyof typeof PROFILE_STATUS] ?? key;
  readonly statusDotColor = (key: string): string =>
    PROFILE_STATUS_STYLES[key as keyof typeof PROFILE_STATUS_STYLES]?.dot ?? '';
  readonly zodiacToLabel = (key: string): string => {
    const zodiac = ZODIAC_LIST[key as ZodiacKey];
    return zodiac ? `${zodiac.tanglish} (${zodiac.english})` : key;
  };
  readonly starToLabel = (key: string | null): string => {
    if (!key) return NOT_SPECIFIED_LABEL;
    const score = STAR_SCORES[key as StarKey];
    return score === undefined ? key : `${key} (${score})`;
  };

  readonly cityList = computed(
    () =>
      DISTRICT_LIST[
        this.profileDetailForm().state().value() as keyof typeof DISTRICT_LIST
      ] as unknown as string[],
  );
  readonly cityPlaceholder = computed(() =>
    this.profileDetailForm().state().value() ? 'Select City' : 'Select a state to choose a city',
  );
}
