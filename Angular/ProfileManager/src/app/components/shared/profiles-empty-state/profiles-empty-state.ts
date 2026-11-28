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
  templateUrl: './profiles-empty-state.html',
  providers: [provideIcons({ lucideFilterX, lucideSearchX, lucideUserPlus, lucideUsers })],
  host: { class: 'col-span-full block' },
})
export class ProfilesEmptyState {
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfilesService);

  protected readonly isNarrowed = this.profileService.isNarrowed;
  protected readonly hasSearchQuery = computed(
    () => this.profileService.filterOptions().searchQuery.trim() !== '',
  );
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
