import { Injectable, inject } from "@angular/core";
import { ComponentStore, tapResponse } from "@ngrx/component-store";
import { ITodo, ITodoComponentState } from "./todo.model";
import { Observable, exhaustMap, tap } from "rxjs";
import { TodoService } from "./todo.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable()
export class TodoStore extends ComponentStore<ITodoComponentState>{
  readonly isLoading$ = this.select(state => state.isLoading)
  readonly errorValue$ = this.select(state => state.errorValue)
  readonly todoList$ = this.select(state => state.todoList)
  private todoService = inject(TodoService)

  constructor() {
    super({
      ...initialValue
    })
  }

  setIsLoading = this.updater((state) => ({ ...state, isLoading: true }))
  setErrorValue = this.updater((state, error: HttpErrorResponse) => ({ ...state, isLoading: false, errorValue: error.error.message }))
  setTodoValue = this.updater((state, todoList: ITodo[]) => ({ ...state, isLoading: false, todoList }))

  getTodo = this.effect((trigger$) => trigger$.pipe(
    tap(this.setIsLoading.bind(this)),
    exhaustMap(() => {
      return this.todoService.getTodo().pipe(
        tapResponse(this.setTodoValue.bind(this), this.setErrorValue.bind(this))
      )
    })
  ))

  addTodo = this.effect((addTodo$: Observable<ITodo>) => addTodo$.pipe(
    tap(this.setIsLoading.bind(this)),
    exhaustMap((todoValue) => {
      return this.todoService.addNewUserTodo(todoValue.userName).pipe(
        tapResponse(this.setTodoValue.bind(this), this.setErrorValue.bind(this))
      )
    })
  ))

}

const initialValue: ITodoComponentState = {
  isLoading: false,
  errorValue: null,
  todoList: []
}
