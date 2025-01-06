import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
import { combineLatest, switchMap } from 'rxjs';
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
    loadTodos: rxMethod<[number, number]>((limit$) => {
      patchState(storeValue, { isLoading: true });
      const _withRxJsService = inject(WithRxJsService);
      return limit$.pipe(
        switchMap(([limit, skip]) => _withRxJsService.getTodos(limit, skip)),
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
    setSkip: (skip: number) => {
      patchState(storeValue, { skip });
    },
  })),

  withHooks((storeValue) => ({
    onInit() {
      if (storeValue.limit() === 0) {
        storeValue.setPageSize(storeValue._defaultLimit);
      }
      storeValue.loadTodos(
        combineLatest([
          toObservable(storeValue.limit),
          toObservable(storeValue.skip),
        ])
      );
    },
  }))
);
