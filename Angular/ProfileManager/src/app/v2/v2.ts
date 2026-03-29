import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { Toolbar } from '../componentsV2/toolbar/toolbar';

@Component({
  selector: 'app-v2',
  imports: [DrawerModule, ButtonModule, RouterModule, Toolbar],
  templateUrl: './v2.html',
  styleUrl: './v2.css',
})
export default class V2 {}
