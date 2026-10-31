import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  effect,
  inject,
  resource,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormRoot } from '@angular/forms/signals';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCopy,
  lucideLoaderCircle,
  lucideMessageCircle,
  lucidePencil,
  lucidePhone,
  lucidePlus,
  lucideTrash2,
} from '@ng-icons/lucide';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmInput } from '@spartan-ng/helm/input';
import { HlmSheetImports } from '@spartan-ng/helm/sheet';
import { HlmSkeleton } from '@spartan-ng/helm/skeleton';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_DATE_TIME_FORMAT,
  NOT_SPECIFIED_LABEL,
} from '../../constant/common.const';
import { TOOLBAR_ACTIONS } from '../../constant/toolbar.const';
import { Comment, ProfileDetail } from '../../models/profile.model';
import { MobileUrlPipe } from '../../pipes/mobile-url.pipe';
import { TimeAgoPipe } from '../../pipes/time-ago.pipe';
import { ProfilesService } from '../../services/profiles.service';
import { ViewportService } from '../../services/viewport.service';
import { ProfileAvatar } from '../shared/profile-avatar/profile-avatar';
import { ScoreRing } from '../shared/score-ring/score-ring';
import { StatusMenu } from '../shared/status-menu/status-menu';
import { ProfileFormFieldsComponent } from './profile-form-fields/profile-form-fields';
import { createProfileForm } from './profile-form';

@Component({
  selector: 'app-profile',
  imports: [
    FormRoot,
    FormsModule,
    DatePipe,
    TimeAgoPipe,
    MobileUrlPipe,
    ProfileAvatar,
    ScoreRing,
    BrnSheetContent,
    HlmBadge,
    HlmButton,
    HlmInput,
    ...HlmSheetImports,
    ...HlmFieldImports,
    ...HlmIconImports,
    ...HlmTabsImports,
    HlmSpinner,
    HlmSkeleton,
    ProfileFormFieldsComponent,
    StatusMenu,
  ],
  templateUrl: './profile.html',
  providers: [
    provideIcons({
      lucidePlus,
      lucideTrash2,
      lucideCheck,
      lucideLoaderCircle,
      lucideCopy,
      lucidePhone,
      lucideMessageCircle,
      lucidePencil,
    }),
  ],
})
export class Profile {
  protected readonly profileService = inject(ProfilesService);
  private readonly viewport = inject(ViewportService);
  private readonly injector = inject(Injector);
  readonly userActionType = computed(() => this.profileService.drawerState().actionType);
  readonly isOpened = computed(() => this.profileService.drawerState().isOpen);
  readonly isView = computed(() => this.userActionType() === TOOLBAR_ACTIONS.view);
  /** Phones get a bottom sheet for view/edit; desktop keeps the right-hand drawer. */
  readonly sheetSide = computed<'right' | 'bottom'>(() =>
    this.viewport.isMobile() ? 'bottom' : 'right',
  );
  readonly NOT_SPECIFIED = NOT_SPECIFIED_LABEL;
  readonly DATE_FORMAT = DISPLAY_DATE_FORMAT;
  readonly DATE_TIME_FORMAT = DISPLAY_DATE_TIME_FORMAT;
  readonly title = computed(() => (this.isView() ? 'View Profile' : 'Edit Profile'));
  readonly buttonLabel = 'Update Profile';

  private readonly shared = createProfileForm({
    isView: () => this.isView(),
    save: (profileData) => this.updateProfile(profileData),
  });
  readonly profileDetailForm = this.shared.profileDetailForm;
  readonly newComment = this.shared.newComment;
  readonly selectedProfileId = computed(() => this.profileService.drawerState().selectedProfileId);
  readonly profileStatusLabel = this.shared.profileStatusLabel;
  readonly profileStatusColor = this.shared.profileStatusColor;
  readonly zodiacLabel = this.shared.zodiacLabel;
  readonly starLabel = this.shared.starLabel;
  readonly locationLabel = this.shared.locationLabel;

  /** Mirrors a status change made from the header menu into the (read-only) view form. */
  onStatusChange(statusId: NonNullable<ProfileDetail['profileStatusId']>): void {
    this.shared.profileDetail.update((detail) => ({ ...detail, profileStatusId: statusId }));
  }

  /** Edit mode splits the form into two tabs; the form state is shared, so nothing is lost. */
  readonly editTab = signal<'details' | 'notes'>('details');
  readonly noteCount = computed(() => this.profileDetailForm.comments().value().length);
  /** True when a Details field is invalid and its error is visible (touched). */
  readonly detailsHasError = computed(() => {
    const f = this.profileDetailForm;
    return [
      f.name,
      f.mobileNumber,
      f.matrimonyId,
      f.profileStatusId,
      f.zodiacSign,
      f.star,
      f.age,
      f.state,
      f.city,
    ].some((field) => field().touched() && field().invalid());
  });

  /** View-mode quick note (saved straight away, without entering edit mode). */
  readonly quickNote = signal('');
  readonly noteSaving = signal(false);
  private readonly quickNoteInput = viewChild<ElementRef<HTMLInputElement>>('quickNoteInput');

  readonly profileResource = resource({
    params: () => {
      const { actionType, selectedProfileId } = this.profileService.drawerState();
      return actionType === TOOLBAR_ACTIONS.view || actionType === TOOLBAR_ACTIONS.edit
        ? selectedProfileId
        : undefined;
    },
    loader: ({ params }) => this.profileService.getProfileById(params!),
  });

  constructor() {
    // Start from a blank form whenever the drawer closes, so nothing from a previous profile
    // reappears next time it opens.
    effect(() => {
      if (this.profileService.drawerState().isOpen === 'closed') {
        untracked(() => {
          this.shared.resetForm();
          this.quickNote.set('');
          this.editTab.set('details');
        });
      }
    });

    effect(() => {
      const profileDetail = this.profileResource.value();
      const profileError = this.profileResource.error();
      if (profileDetail) {
        this.shared.profileDetail.set(profileDetail);
      }
      if (profileError) {
        toast.error('Failed to fetch profile');
        this.closeDrawer();
      }
      untracked(() => {
        if (this.userActionType() === TOOLBAR_ACTIONS.view) {
          this.profileDetailForm().disabled();
        }
      });
    });
  }

  copyToClipboard(value: string | null | undefined, label: string): void {
    this.profileService.copyToClipboard(value, label);
  }

  closeDrawer(): void {
    this.profileService.closeDrawer();
  }

  addComment(): void {
    this.shared.addComment();
  }

  deleteComment(comment: Comment): void {
    this.shared.deleteComment(comment);
  }

  /**
   * Plain value binding (not ngModel): NgModel applies `disabled` asynchronously, which would
   * make the refocus after saving race with the re-enable.
   */
  onQuickNoteInput(event: Event): void {
    this.quickNote.set((event.target as HTMLInputElement).value);
  }

  onTabActivated(tab: string): void {
    this.editTab.set(tab === 'notes' ? 'notes' : 'details');
  }

  /** Appends a note from view mode via `ProfilesService.addNote` (arrayUnion). */
  async addQuickNote(): Promise<void> {
    const value = this.quickNote().trim();
    const id = this.profileService.drawerState().selectedProfileId;
    if (!value || !id || this.noteSaving()) {
      return;
    }
    this.noteSaving.set(true);
    try {
      const note = await this.profileService.addNote(id, value);
      this.shared.profileDetail.update((profile) => ({
        ...profile,
        comments: [...profile.comments, note],
      }));
      this.quickNote.set('');
      toast.success('Note added');
      this.profileService.refreshProfiles();
    } catch {
      toast.error('Failed to add note');
    } finally {
      this.noteSaving.set(false);
      // The input is disabled while saving, which drops focus; give it back once enabled.
      afterNextRender(() => this.quickNoteInput()?.nativeElement.focus(), {
        injector: this.injector,
      });
    }
  }

  /**
   * Runs on every form submit attempt. If validation fails, show the Details tab (errors may
   * belong to a tab that is not visible) and focus the first invalid field.
   */
  onSubmitAttempt(): void {
    const first = this.profileDetailForm().errorSummary()[0];
    if (!first) {
      return;
    }
    this.editTab.set('details');
    afterNextRender(() => first.fieldTree().focusBoundControl(), { injector: this.injector });
  }

  private async updateProfile(profileData: Partial<ProfileDetail>): Promise<void> {
    return await this.profileService
      .updateProfile(this.profileService.drawerState().selectedProfileId!, profileData)
      .then(() => {
        toast.success('Profile updated successfully');
        this.profileService.refreshProfiles();
        this.closeDrawer();
      })
      .catch(() => {
        toast.error('Failed to update profile');
      });
  }
}
