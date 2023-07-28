import { createReducer, on } from "@ngrx/store";
import { incrementAction } from "./counter.actions";

const initialState = 0;

export const counterReducer = createReducer(initialState, on(incrementAction, (state, actions) => state + actions.value))
