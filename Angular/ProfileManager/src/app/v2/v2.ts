import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { TopBar } from '../componentsV2/top-bar/top-bar';

@Component({
  selector: 'app-v2',
  imports: [DrawerModule, ButtonModule, TopBar],
  templateUrl: './v2.html',
  styleUrl: './v2.css',
})
export default class V2 {
  sidebarVisible = true;
}
