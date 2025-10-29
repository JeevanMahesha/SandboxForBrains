import { createReducer, on } from "@ngrx/store";
import { decrementAction, incrementAction, setAction } from "./counter.actions";

const initialState = 0;

export const counterReducer = createReducer(initialState,
    on(incrementAction, (state, actions) => state + actions.value),
    on(decrementAction, (state, action) => state - action.value),
    on(setAction, (state, action) => action.value)
)
