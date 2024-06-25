import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  apiData = toSignal<ApiResponse>(
    this.http
      .get<Category[]>('https://jsonplaceholder.typicode.com/todos')
      .pipe(map((res) => ({ categories: res, subcategories: res })))
  );

  categories = computed(() => this.apiData()!.categories);
  subcategories = computed(() => this.apiData()!.subcategories);

  form = this.fb.group({
    category: ['', Validators.required],
    subcategory: ['', Validators.required],
  });

  filteredSubcategories = computed(() => {
    const categoryId = this.form.get('category')?.value as unknown as number;
    return categoryId
      ? this.subcategories().filter((sub) => sub.id === categoryId)
      : [];
  });

  submitResult = signal<string | null>(null);

  onSubmit() {
    if (this.form.valid) {
      this.http
        .post('https://api.example.com/submit', this.form.value)
        .subscribe({
          next: (response: any) => {
            this.submitResult.set('Success: ' + JSON.stringify(response));
          },
          error: (error) => {
            this.submitResult.set('Error: ' + error.message);
          },
        });
    }
  }
}

interface ApiResponse {
  categories: Category[];
  subcategories: Subcategory[];
}

interface Category {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface Subcategory {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
