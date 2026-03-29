import { Component } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-profile',
  imports: [DrawerModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  isVisable = true;
}
