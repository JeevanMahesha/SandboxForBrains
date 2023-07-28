import { createAction, props } from "@ngrx/store";

export const incrementAction = createAction('[Counter] Increment',
    props<{ value: number }>(

    ))