import { createSelector } from "@ngrx/store"

export const selectCount = (state: { counter: number }) => state.counter
export const doubleSelectCount = createSelector(selectCount, (stateValue) => stateValue * 2)