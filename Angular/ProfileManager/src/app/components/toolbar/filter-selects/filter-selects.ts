import { Component, input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { STAR_SCORES } from '../../../constant/common.const';

@Component({
  selector: 'app-filter-selects',
  imports: [FormField, ...HlmSelectImports],
  templateUrl: './filter-selects.html',
})
export default class FilterSelects {
  readonly starMatchScore = input.required<FieldTree<number | null, string, 'writable'>>();

  readonly scoreMatchOptions = Array.from(new Set(Object.values(STAR_SCORES))) as number[];
}
