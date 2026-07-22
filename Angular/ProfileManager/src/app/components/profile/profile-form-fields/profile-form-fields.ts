import { KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideMessageCircle, lucidePhone } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmSeparator } from '@spartan-ng/helm/separator';
import {
  DISTRICT_LIST,
  MATCHING_STARS,
  PROFILE_STATUS,
  PROFILE_STATUS_COLORS_MAP,
  ZODIAC_SIGN_LIST,
} from '../../../constant/common.const';
import { TOOLBAR_ACTIONS } from '../../../constant/toolbar.const';
import { ProfileDetail } from '../../../models/profile.model';
import { ToolbarAction } from '../../../models/toolbar.model';
import { MobileUrlPipe } from '../../../pipes/mobile-url.pipe';
import { ProfilesService } from '../../../services/profiles.service';

@Component({
  selector: 'app-profile-form-fields',
  imports: [
    FormField,
    NgTemplateOutlet,
    KeyValuePipe,
    MobileUrlPipe,
    HlmBadge,
    HlmButton,
    HlmInput,
    HlmSeparator,
    ...HlmFieldImports,
    ...HlmSelectImports,
    ...HlmIconImports,
  ],
  templateUrl: './profile-form-fields.html',
  providers: [provideIcons({ lucideCopy, lucidePhone, lucideMessageCircle })],
  host: { class: 'flex flex-col gap-4' },
})
export class ProfileFormFieldsComponent {
  private readonly profileService = inject(ProfilesService);

  readonly profileDetailForm = input.required<FieldTree<ProfileDetail>>();
  readonly actionType = input.required<ToolbarAction | null>();

  readonly TOOLBAR_ACTIONS_VALUES = TOOLBAR_ACTIONS;
  readonly PROFILE_STATUS_DATA = PROFILE_STATUS;
  readonly ZODIAC_SIGN_DATA = Object.entries(ZODIAC_SIGN_LIST).map(([key, value]) => ({
    key,
    value: `${value.tanglish} (${value.english})`,
  }));
  readonly starList = computed(() => {
    const zodiac = this.profileDetailForm().zodiacSign().value();
    if (!zodiac) return [];
    return (
      ZODIAC_SIGN_LIST[zodiac as keyof typeof ZODIAC_SIGN_LIST]?.stars as readonly string[] ?? []
    ).map((star) => ({
      key: star,
      value: `${star} (${MATCHING_STARS[star as keyof typeof MATCHING_STARS]})`,
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
  readonly zodiacToLabel = (key: string): string => {
    const zodiac = ZODIAC_SIGN_LIST[key as keyof typeof ZODIAC_SIGN_LIST];
    return zodiac ? `${zodiac.tanglish} (${zodiac.english})` : key;
  };
  readonly starToLabel = (key: string): string => {
    const score = MATCHING_STARS[key as keyof typeof MATCHING_STARS];
    return score === undefined ? key : `${key} (${score})`;
  };

  readonly profileStatusLabel = computed(() => {
    const id = this.profileDetailForm().profileStatusId().value() as
      keyof typeof PROFILE_STATUS | null;
    return id ? PROFILE_STATUS[id] : null;
  });
  readonly profileStatusColor = computed(() => {
    const id = this.profileDetailForm().profileStatusId().value() as
      keyof typeof PROFILE_STATUS_COLORS_MAP | null;
    return id ? PROFILE_STATUS_COLORS_MAP[id] : null;
  });

  readonly cityList = computed(
    () =>
      DISTRICT_LIST[
        this.profileDetailForm().state().value() as keyof typeof DISTRICT_LIST
      ] as unknown as string[],
  );
  readonly cityPlaceholder = computed(() =>
    this.profileDetailForm().state().value() ? 'Select City' : 'Select a state to choose a city',
  );

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }
}
