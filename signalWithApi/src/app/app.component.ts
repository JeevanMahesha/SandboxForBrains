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
      .pipe(map((res) => ({ categories: [], subcategories: res }))),
    { initialValue: null }
  );

  form = this.fb.group({
    category: ['', Validators.required],
    subcategory: ['', Validators.required],
  });

  filteredSubcategories = toSignal(
    this.form.controls.category.valueChanges.pipe(
      map((categoryId) => {
        return this.apiData()?.subcategories.filter(
          (sub) => sub.id === (categoryId as unknown as number)
        );
      })
    )
  );

  onSubmit() {
    console.log(this.apiData());
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
