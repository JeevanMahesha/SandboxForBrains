import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { PROFILE_STATUS, STAR_SCORES } from '../../../constant/common.const';

@Component({
  selector: 'app-filter-selects',
  imports: [FormField, ...HlmSelectImports],
  templateUrl: './filter-selects.html',
})
export default class FilterSelects {
  readonly profileStatus =
    input.required<FieldTree<keyof typeof PROFILE_STATUS | null, string, 'writable'>>();
  readonly starMatchScore = input.required<FieldTree<number | null, string, 'writable'>>();

  readonly profileStatusOptions = Object.entries(PROFILE_STATUS).map(([key, value]) => ({
    label: value,
    value: key,
  }));
  readonly scoreMatchOptions = Array.from(new Set(Object.values(STAR_SCORES))) as number[];

  readonly statusToLabel = (value: keyof typeof PROFILE_STATUS | null): string =>
    value != null ? PROFILE_STATUS[value] : '';
}
