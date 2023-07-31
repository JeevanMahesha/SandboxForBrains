import { createAction, props } from "@ngrx/store";

export const incrementAction = createAction('[Counter] Increment',
    props<{ value: number }>())

export const decrementAction = createAction('[Counter] Decrement',
    props<{ value: number }>())

export const initialAction = createAction('[Counter] Initial')

export const setAction = createAction('[Counter] Set', props<{ value: number }>())