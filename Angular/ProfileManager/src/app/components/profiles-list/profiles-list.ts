import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, Resource, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PopoverModule } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ToolbarModule } from 'primeng/toolbar';
import { ProfileDetail } from '../../models/profile';
import { ToolbarAction } from '../../models/toolbar.model';
import { ProfilesService } from '../../services/profiles.service';
import { Profile } from '../profile/profile';
import { StarMatch } from '../star-match/star-match';
import { Toolbar } from '../toolbar/toolbar';
import { ZodiacSigns } from '../zodiac-signs/zodiac-signs';
import { ProfilesListDesktopView } from './profiles-list-desktop-view/profiles-list-desktop-view';
import { ProfilesListMobileView } from './profiles-list-mobile-view/profiles-list-mobile-view';

@Component({
  selector: 'app-profiles-list',
  imports: [
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    SplitButtonModule,
    ToolbarModule,
    InputTextModule,
    ToggleButtonModule,
    FormsModule,
    SelectModule,
    TableModule,
    Profile,
    PopoverModule,
    InputGroupModule,
    InputGroupAddonModule,
    Toolbar,
    StarMatch,
    ZodiacSigns,
    TagModule,
    DataViewModule,
    CommonModule,
    SkeletonModule,
    ProfilesListMobileView,
    ProfilesListDesktopView,
  ],
  templateUrl: './profiles-list.html',
  styleUrl: './profiles-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilesList {
  actionType = input<ToolbarAction>();
  openDrawer = input<boolean>();
  selectedProfileId = input<string>();
  profiles: Resource<ProfileDetail[]>;
  toggleStarMatch = signal<MouseEvent | null>(null);
  toggleZodiacSigns = signal<MouseEvent | null>(null);
  private readonly profileService = inject(ProfilesService);

  constructor() {
    this.profiles = this.profileService.profiles;
  }
}
