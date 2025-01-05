import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { switchMap } from 'rxjs';
import { APIResponse, Todo } from './with-rx-js.model';
import { WithRxJsService } from './with-rx-js.service';

type TodoState = {
  todos: Todo[];
  isLoading: boolean;
  total: number;
  limit: number;
  skip: number;
};

const initialState: TodoState = {
  todos: [],
  isLoading: true,
  total: 0,
  limit: 0,
  skip: 0,
};

export const TodoWithRxjsStore = signalStore(
  withState(initialState),
  withProps(() => ({
    _todoService: inject(WithRxJsService),
    _defaultLimit: 5,
  })),
  withMethods((storeValue) => ({
    loadTodos: rxMethod<number>((limit$) => {
      patchState(storeValue, { isLoading: true });
      const _withRxJsService = inject(WithRxJsService);
      return limit$.pipe(
        switchMap((limit) => _withRxJsService.getTodos(limit)),
        tapResponse<APIResponse, HttpErrorResponse>({
          next: (data) => {
            patchState(storeValue, {
              todos: data.todos,
              total: data.total,
              limit: data.limit,
              skip: data.skip,
              isLoading: false,
            });
          },
          error: (error) => {
            console.error(error);
            patchState(storeValue, { isLoading: false });
          },
        })
      );
    }),
    setPageSize: (limit: number) => {
      patchState(storeValue, { limit });
    },
  })),

  withHooks((storeValue) => ({
    onInit() {
      if (storeValue.limit() === 0) {
        storeValue.setPageSize(storeValue._defaultLimit);
      }
      storeValue.loadTodos(storeValue.limit);
    },
  }))
);
