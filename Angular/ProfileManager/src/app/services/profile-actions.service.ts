import { Service, inject } from '@angular/core';
import { toast } from '@spartan-ng/brain/sonner';
import { ToolbarAction } from '../models/toolbar.model';
import { ConfirmService } from './confirm.service';
import { ProfilesService } from './profiles.service';

/**
 * What the user can do to a profile from the list or the drawer, with the prompts and toasts that
 * go with it. `ProfilesService` stays Firestore and state only; this is the UI side of it.
 */
@Service()
export class ProfileActionsService {
  private readonly profiles = inject(ProfilesService);
  private readonly confirmService = inject(ConfirmService);

  /** `view` and `edit` open the drawer; `delete` asks first, then deletes with a short Undo. */
  userActionEvent(userActionType: ToolbarAction, profileId: string | null): void {
    if (userActionType === 'delete') {
      void this.deleteProfile(profileId!);
      return;
    }
    this.profiles.openDrawer(userActionType, profileId);
  }

  /** Asks for confirmation, then hides the row at once and offers Undo until the delete is real. */
  async deleteProfile(id: string): Promise<void> {
    const target = this.profiles.findLoadedProfile(id);
    const confirmed = await this.confirmService.confirm({
      title: target ? `Delete ${target.name} (${target.matrimonyId})?` : 'Confirm Delete',
      description: target ? "This can't be undone." : 'Do you want to delete this record?',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!confirmed) {
      return;
    }

    const pending = this.profiles.scheduleDelete(id, target, () =>
      toast.error('Failed to delete profile'),
    );
    if (!pending) {
      return;
    }
    toast.success(target ? `Deleted ${target.name} (${target.matrimonyId})` : 'Profile deleted', {
      duration: ProfilesService.DELETE_UNDO_MS,
      action: {
        label: 'Undo',
        onClick: () => {
          if (pending.undo()) {
            toast.success('Profile restored');
          }
        },
      },
    });
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    if (!value) return;
    navigator.clipboard.writeText(value).then(
      () => {
        toast.success(`${label} copied to clipboard!`);
      },
      () => {
        toast.error(`Failed to copy ${label.toLowerCase()}`);
      },
    );
  }
}
