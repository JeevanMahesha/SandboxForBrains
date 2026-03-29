import { NgClass } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-top-bar',
  imports: [NgClass],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  public isDarkTheme: Signal<boolean>;
  private readonly layoutService = inject(LayoutService);

  constructor() {
    this.isDarkTheme = this.layoutService.isDarkTheme;
  }
  onMenuToggle() {
    this.layoutService.onMenuToggle();
  }

  toggleTheme() {
    this.layoutService.layoutConfig.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }
}
