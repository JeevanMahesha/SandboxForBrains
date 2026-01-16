import { Component, effect, input, model, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { Comment } from '../../../models/profile';
import { FormValueControl } from '@angular/forms/signals';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-comments',
  imports: [MatIconModule, MatFormFieldModule, DatePipe, MatInputModule, MatButtonModule],
  templateUrl: './comments.html',
  styleUrl: './comments.css',
})
export class Comments implements FormValueControl<Comment[]> {
  value = model<Comment[]>([]);
  commentInputHasValue = output<boolean>();
  newComment = signal<string>('');

  public readonly action = input.required<string | null | undefined>();

  constructor() {
    effect(() => {
      this.commentInputHasValue.emit(this.newComment().trim() === '');
    });
  }

  removeComment(index: number) {
    this.value.update((prev) => prev.filter((_, i) => i !== index));
  }
  addComment() {
    this.value.update((prev) => [
      ...prev,
      { value: this.newComment(), createDateAndTime: new Date() },
    ]);
    this.newComment.set('');
  }
}
