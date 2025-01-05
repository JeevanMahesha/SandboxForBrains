import { Component, inject } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { WithRxJsService } from './with-rx-js.service';
import { TodoWithRxjsStore } from './withRxJsTodoStore';

@Component({
  selector: 'app-with-rx-js',
  imports: [MatTableModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './with-rx-js.component.html',
  styleUrl: './with-rx-js.component.css',
  providers: [WithRxJsService, TodoWithRxjsStore],
})
export class WithRxJsComponent {
  #todoStore = inject(TodoWithRxjsStore);
  displayedColumns: string[] = ['id', 'todo', 'userId', 'completed'];
  isLoading = this.#todoStore.isLoading;
  todos = this.#todoStore.todos;
  pageSize = this.#todoStore.limit;

  pageSizeChanged(pageSize: PageEvent): void {
    this.#todoStore.setPageSize(pageSize.pageSize);
  }
}
