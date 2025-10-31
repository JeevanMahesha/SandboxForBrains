import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterLink } from '@angular/router';
import { MATCHING_STARS } from '../../constant/common';
import { RATING_STARS } from './matching-stars.constant';

interface StarEntry {
  name: string;
  score: number;
  scoreColor: string;
  progressBarColor: string;
  scoreLabel: string;
}

@Component({
  selector: 'app-matching-stars',
  imports: [
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterLink,
  ],
  templateUrl: './matching-stars.html',
  styleUrls: ['./matching-stars.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MatchingStarsComponent {
  private router = inject(Router);

  // Convert MATCHING_STARS object to array and sort by score descending
  starEntries = computed<StarEntry[]>(() => {
    return Object.entries(MATCHING_STARS)
      .map(([name, score]) => {
        if (score >= 8) {
          return {
            name,
            score,
            scoreColor: 'bg-green-100 text-green-800',
            progressBarColor: 'progress-bar-green',
            scoreLabel: 'Excellent Match',
          };
        } else if (score >= 6) {
          return {
            name,
            score,
            scoreColor: 'bg-yellow-100 text-yellow-800',
            progressBarColor: 'progress-bar-yellow',
            scoreLabel: 'Good Match',
          };
        } else if (score === 5) {
          return {
            name,
            score,
            scoreColor: 'bg-orange-100 text-orange-800',
            progressBarColor: 'progress-bar-orange',
            scoreLabel: 'Fair Match',
          };
        } else {
          return {
            name,
            score,
            scoreColor: 'bg-red-100 text-red-800',
            progressBarColor: 'progress-bar-red',
            scoreLabel: 'Low Match',
          };
        }
      })
      .sort((a, b) => b.score - a.score);
  });

  // Filter state
  selectedFilter = signal<keyof typeof RATING_STARS>('all');

  // Filtered stars based on selected filter
  filteredStars = computed(() => {
    const filter = this.selectedFilter();
    const stars = this.starEntries();
    switch (filter) {
      case 'all':
        return stars;
      case 'excellent':
        return stars.filter((s) => s.score >= 8);
      case 'good':
        return stars.filter((s) => s.score >= 6 && s.score < 8);
      case 'fair':
        return stars.filter((s) => s.score === 5);
      case 'low':
        return stars.filter((s) => s.score < 5);
      default:
        return stars;
    }
  });

  // Statistics
  stats = computed(() => {
    const stars = this.starEntries();
    return {
      total: stars.length,
      excellent: stars.filter((s) => s.score >= 8).length,
      good: stars.filter((s) => s.score >= 6 && s.score < 8).length,
      fair: stars.filter((s) => s.score === 5).length,
      low: stars.filter((s) => s.score < 5).length,
    };
  });

  goBack(): void {
    this.router.navigate(['/']);
  }
}
