import {Todo} from './with-rx-js.model';
import {signalStore, withState} from '@ngrx/signals';

type TodoState = {
  todos: Todo[];
  isLoading: boolean;
};

const initialState: TodoState = {
  todos: [],
  isLoading: true,
};

export const TodoWithRxjsStore = signalStore(
    withState(initialState),

  );
