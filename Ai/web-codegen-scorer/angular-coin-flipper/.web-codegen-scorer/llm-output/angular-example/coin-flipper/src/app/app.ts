import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  isFlipping = signal(false);
  result = signal<'Heads' | 'Tails' | null>(null);
  coinRotation = signal<0 | 180>(0); // 0 for Heads, 180 for Tails

  flipCoin(): void {
    if (this.isFlipping()) {
      return; // Prevent multiple flips while animating
    }

    this.isFlipping.set(true);
    this.result.set(null); // Clear previous result

    const animationDuration = 2000; // 2 seconds for the visual flip animation

    setTimeout(() => {
      const isHeads = Math.random() < 0.5;
      this.result.set(isHeads ? 'Heads' : 'Tails');
      this.isFlipping.set(false); // Stop the flipping animation
      this.coinRotation.set(isHeads ? 0 : 180); // Apply final rotation for result
    }, animationDuration);
  }
}
