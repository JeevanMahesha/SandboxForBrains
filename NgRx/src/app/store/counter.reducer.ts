import { createReducer, on } from "@ngrx/store";
import { incrementAction } from "./counter.actions";

const initialState = 0;

export const counterReducer = createReducer(initialState, on(incrementAction, (state, actions) =>{
    if (actions.actionType === 'add') {
        state + actions.value
    }else if (actions.actionType === 'sub') {
        state - actions.value
    }
}))
