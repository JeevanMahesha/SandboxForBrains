import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideFilter,
  lucideFilterX,
  lucideMoon,
  lucideMonitor,
  lucidePlus,
  lucidePowerOff,
  lucideSearch,
  lucideStar,
  lucideSun,
  lucideSparkles,
} from '@ng-icons/lucide';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { PROFILE_STATUS } from '../../constant/common.const';
import { ProfilesService } from '../../services/profiles.service';
import { AuthService } from '../../services/auth.service';
import { ThemeService, ThemePreference } from '../../services/theme.service';
import V2StatsBar from './stats-bar/stats-bar';
import V2ProfilesDesktop from './desktop-view/profiles-desktop-v2';
import V2ProfilesMobile from './mobile-view/profiles-mobile-v2';
import V2ProfileDrawer from '../profile-drawer/profile-drawer-v2';

@Component({
  selector: 'app-v2-profiles-list',
  imports: [
    ...HlmIconImports,
    V2StatsBar,
    V2ProfilesDesktop,
    V2ProfilesMobile,
    V2ProfileDrawer,
  ],
  providers: [
    provideIcons({
      lucideSearch, lucideFilter, lucideFilterX, lucidePlus, lucideChevronDown,
      lucideStar, lucideSparkles, lucideSun, lucideMoon, lucideMonitor, lucidePowerOff,
    }),
  ],
  templateUrl: './profiles-list-v2.html',
})
export default class ProfilesListV2 {
  protected profilesService = inject(ProfilesService);
  protected authService     = inject(AuthService);
  protected themeService    = inject(ThemeService);
  private router            = inject(Router);

  readonly profiles       = this.profilesService.profiles;
  readonly filterOptions  = this.profilesService.filterOptions;
  readonly drawerState    = this.profilesService.drawerState;

  readonly menuOpen       = signal(false);
  readonly showZodiac     = signal(false);
  readonly showStars      = signal(false);

  readonly totalCount = computed(() => this.profiles.value()?.length ?? 0);

  readonly statusList = Object.keys(PROFILE_STATUS) as (keyof typeof PROFILE_STATUS)[];
  readonly PROFILE_STATUS = PROFILE_STATUS;

  readonly themeIcon = computed<string>(() => {
    const p = this.themeService.preference();
    if (p === 'light') return 'lucideSun';
    if (p === 'dark')  return 'lucideMoon';
    return 'lucideMonitor';
  });

  readonly themeLabel = computed<string>(() => {
    const p = this.themeService.preference();
    if (p === 'light') return 'Light';
    if (p === 'dark')  return 'Dark';
    return 'System';
  });

  setStatus(value: string): void {
    const key = value === '' ? null : (value as keyof typeof PROFILE_STATUS);
    this.filterOptions.update((o) => ({ ...o, profileStatus: key }));
  }

  setScore(value: string): void {
    const score = value === '' ? null : Number(value);
    this.filterOptions.update((o) => ({ ...o, starMatchScore: score }));
  }

  setSearch(value: string): void {
    this.filterOptions.update((o) => ({ ...o, searchQuery: value }));
  }

  toggleSort(): void {
    this.filterOptions.update((o) => ({ ...o, viewOrderCheck: !o.viewOrderCheck }));
  }

  clearFilters(): void {
    this.filterOptions.set({ viewOrderCheck: false, searchQuery: '', profileStatus: null, starMatchScore: null });
  }

  readonly hasActiveFilter = computed(() => {
    const f = this.filterOptions();
    return !!f.searchQuery || !!f.profileStatus || f.starMatchScore !== null || f.viewOrderCheck;
  });

  openAdd(): void {
    this.profilesService.userActionEvent('create', null);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    toast.success('Logged out successfully');
    this.router.navigate(['/v2/login']);
  }

  cycleTheme(): void {
    this.themeService.cyclePreference();
  }

  setTheme(p: ThemePreference): void {
    this.themeService.setPreference(p);
  }
}
