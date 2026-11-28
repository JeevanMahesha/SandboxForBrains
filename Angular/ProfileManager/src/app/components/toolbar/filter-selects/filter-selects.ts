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
  /** Trigger id; the toolbar row and the phone sheet both render this, so each passes its own. */
  readonly triggerId = input('star_match_filter');
  readonly starMatchScore = input.required<FieldTree<number | null, string, 'writable'>>();

  readonly scoreMatchOptions = Array.from(new Set(Object.values(STAR_SCORES))) as number[];
}
