import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrementAction, incrementAction } from "./counter.actions";
import { tap, withLatestFrom } from "rxjs";
import { Store } from "@ngrx/store";
import { selectCount } from "./counter.select";

@Injectable()
export class CounterEffects {
    actions$ = inject(Actions)
    store = inject(Store<{ counter: number }>)
    saveCount = createEffect(() => this.actions$.pipe(
        ofType(incrementAction, decrementAction),
        withLatestFrom(this.store.select(selectCount)),
        tap(([action, counter]) => {
            localStorage.setItem('counter', counter.toString())
            // action is initial value in store
            // counter is current value 
            console.log(action, counter);

        })
    ),
        {
            dispatch: false
        }
    );
}