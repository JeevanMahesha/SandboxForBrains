import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilterX, lucideSearchX, lucideUserPlus, lucideUsers } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { ProfilesService } from '../../../services/profiles.service';

/** Empty list: either no profiles exist yet, or the active search/filters match none. */
@Component({
  selector: 'app-profiles-empty-state',
  imports: [HlmButton, NgIcon, ...HlmIconImports],
  template: `
    <div class="flex flex-col items-center gap-3 px-4 py-10 text-center" role="status">
      <span
        class="bg-muted text-muted-foreground grid size-14 place-items-center rounded-full"
        aria-hidden="true"
      >
        <ng-icon [name]="isNarrowed() ? 'lucideSearchX' : 'lucideUsers'" size="26" />
      </span>
      @if (isNarrowed()) {
        <p class="text-lg font-semibold">No profiles found.</p>
        <p class="text-muted-foreground max-w-sm text-sm break-words">
          {{ matchMessage() }}. Try a different search or clear the filters.
        </p>
        <button type="button" hlmBtn variant="outline" (click)="clearFilters()">
          <ng-icon hlm name="lucideFilterX" size="sm" />
          Clear filters
        </button>
      } @else {
        <p class="text-lg font-semibold">No profiles yet</p>
        <p class="text-muted-foreground max-w-sm text-sm">
          Add your first profile to start tracking matches.
        </p>
        <button type="button" hlmBtn (click)="addProfile()">
          <ng-icon hlm name="lucideUserPlus" size="sm" />
          Add Profile
        </button>
      }
    </div>
  `,
  providers: [provideIcons({ lucideFilterX, lucideSearchX, lucideUserPlus, lucideUsers })],
  host: { class: 'col-span-full block' },
})
export class ProfilesEmptyState {
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfilesService);

  protected readonly isNarrowed = this.profileService.isNarrowed;
  protected readonly matchMessage = computed(() => {
    const query = this.profileService.filterOptions().searchQuery.trim();
    return query ? `No profiles match "${query}"` : 'No profiles match these filters';
  });

  protected clearFilters(): void {
    this.profileService.clearFilters();
  }

  protected addProfile(): void {
    void this.router.navigate(['/profiles/new']);
  }
}
