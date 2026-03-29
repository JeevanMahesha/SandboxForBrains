import { NgClass } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { SideBar } from '../componentsV2/side-bar/side-bar';
import { TopBar } from '../componentsV2/top-bar/top-bar';
import { LayoutService } from '../services/layout.service';

@Component({
  selector: 'app-v2',
  imports: [DrawerModule, ButtonModule, TopBar, SideBar, RouterModule, NgClass],
  templateUrl: './v2.html',
  styleUrl: './v2.css',
})
export default class V2 {
  layoutService = inject(LayoutService);

  constructor() {
    effect(() => {
      const state = this.layoutService.layoutState();
      if (state.mobileMenuActive) {
        document.body.classList.add('blocked-scroll');
      } else {
        document.body.classList.remove('blocked-scroll');
      }
    });
  }

  containerClass = computed(() => {
    const config = this.layoutService.layoutConfig();
    const state = this.layoutService.layoutState();
    return {
      'layout-overlay': config.menuMode === 'overlay',
      'layout-static': config.menuMode === 'static',
      'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
      'layout-overlay-active': state.overlayMenuActive,
      'layout-mobile-active': state.mobileMenuActive,
    };
  });
}
