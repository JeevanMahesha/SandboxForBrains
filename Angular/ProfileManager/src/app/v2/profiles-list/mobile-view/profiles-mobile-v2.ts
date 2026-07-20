import { Component, inject, input, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideEye, lucidePencil, lucideTrash2, lucideEllipsis } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { ProfileDetail } from '../../../models/profile.model';
import { ProfilesService } from '../../../services/profiles.service';
import { ZODIAC_SIGN_LIST } from '../../../constant/common.const';
import V2StatusBadge from '../../shared/status-badge';

@Component({
  selector: 'app-v2-profiles-mobile',
  imports: [...HlmIconImports, ...HlmDropdownMenuImports, HlmSkeleton, HlmButton, V2StatusBadge],
  providers: [provideIcons({ lucideCopy, lucideEye, lucidePencil, lucideTrash2, lucideEllipsis })],
  templateUrl: './profiles-mobile-v2.html',
})
export default class V2ProfilesMobile {
  profiles = input<ProfileDetail[]>([]);
  loading  = input(false);

  private svc = inject(ProfilesService);

  readonly page     = signal(1);
  readonly pageSize = signal(10);

  pagedProfiles() {
    const start = (this.page() - 1) * this.pageSize();
    return this.profiles().slice(start, start + this.pageSize());
  }

  zodiacLabel(key: string | null | undefined): string {
    if (!key || !(key in ZODIAC_SIGN_LIST)) return '—';
    return ZODIAC_SIGN_LIST[key as keyof typeof ZODIAC_SIGN_LIST].tanglish;
  }

  view(id: string | undefined):   void { if (id) this.svc.userActionEvent('view',   id); }
  edit(id: string | undefined):   void { if (id) this.svc.userActionEvent('edit',   id); }
  delete(id: string | undefined): void { if (id) this.svc.userActionEvent('delete', id); }

  copyId(id: string | undefined): void {
    this.svc.copyToClipboard(id, 'Matrimony ID');
  }
  copyPhone(num: string | undefined): void {
    this.svc.copyToClipboard(num, 'Mobile number');
  }
}
