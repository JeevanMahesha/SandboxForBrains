import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown, lucideLoaderCircle } from '@ng-icons/lucide';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { PROFILE_STATUS, PROFILE_STATUS_STYLES } from '../../../constant/common.const';
import { ProfilesService } from '../../../services/profiles.service';
import { ViewportService } from '../../../services/viewport.service';

type StatusId = keyof typeof PROFILE_STATUS;

/**
 * The status pill of a profile, doubling as the trigger of a status picker. Selecting a status
 * saves at once (optimistic, rolled back on failure) and offers Undo in a toast.
 */
@Component({
  selector: 'app-status-menu',
  imports: [
    NgTemplateOutlet,
    HlmBadge,
    BrnSheetContent,
    ...HlmDropdownMenuImports,
    ...HlmIconImports,
    ...HlmSheetImports,
  ],
  templateUrl: './status-menu.html',
  providers: [provideIcons({ lucideCheck, lucideChevronDown, lucideLoaderCircle })],
  host: { class: 'inline-flex' },
})
export class StatusMenu {
  private readonly profileService = inject(ProfilesService);
  protected readonly mobile = inject(ViewportService).isMobile;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly profileId = input.required<string>();
  readonly statusId = input.required<StatusId | null>();
  /** Fires on every status change this component makes: apply, rollback and undo. */
  readonly statusChange = output<StatusId>();

  protected readonly options = (Object.keys(PROFILE_STATUS) as StatusId[]).map((id) => ({
    id,
    label: PROFILE_STATUS[id],
    dot: PROFILE_STATUS_STYLES[id].dot,
  }));
  protected readonly pending = signal(false);
  protected readonly sheetState = signal<BrnDialogState>('closed');

  protected readonly label = computed(() => {
    const id = this.statusId();
    return id ? PROFILE_STATUS[id] : 'No status';
  });
  protected readonly badgeClass = computed(() => {
    const id = this.statusId();
    return id ? PROFILE_STATUS_STYLES[id].badge : '';
  });

  protected stop(event: Event): void {
    // The pill sits inside clickable cards: neither a click nor Enter/Space may open the drawer.
    event.stopPropagation();
  }

  protected choose(next: StatusId): void {
    this.sheetState.set('closed');
    const previous = this.statusId();
    if (this.pending() || next === previous) return;
    void this.change(next, previous);
  }

  private async change(next: StatusId, previous: StatusId | null): Promise<void> {
    this.pending.set(true);
    this.statusChange.emit(next);
    try {
      await this.profileService.updateProfileStatus(this.profileId(), next);
    } catch {
      if (previous) this.statusChange.emit(previous);
      toast.error('Failed to update status');
      return;
    } finally {
      this.pending.set(false);
      this.restoreFocus();
    }

    toast.success(`Status changed to ${PROFILE_STATUS[next]}`, {
      duration: 6000,
      action: previous
        ? { label: 'Undo', onClick: () => void this.undo(next, previous) }
        : undefined,
    });
  }

  /** The button is disabled while saving, which drops focus; give it back once it is enabled. */
  private restoreFocus(): void {
    afterNextRender(
      () => {
        if (document.activeElement === document.body || document.activeElement === null) {
          this.host.nativeElement.querySelector('button')?.focus();
        }
      },
      { injector: this.injector },
    );
  }

  /** Writes the previous status back by id; fails (toast) rather than recreating a deleted doc. */
  private async undo(current: StatusId, previous: StatusId): Promise<void> {
    const id = this.profileId();
    this.statusChange.emit(previous);
    try {
      await this.profileService.updateProfileStatus(id, previous);
      toast.success(`Status restored to ${PROFILE_STATUS[previous]}`);
    } catch {
      this.statusChange.emit(current);
      toast.error('Failed to undo status change');
    }
  }
}
