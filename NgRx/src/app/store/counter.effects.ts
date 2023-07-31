import { Injectable, inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { decrementAction, incrementAction } from "./counter.actions";
import { tap } from "rxjs";

@Injectable()
export class CounterEffects {
    actions$ = inject(Actions)
    saveCount = createEffect(() => this.actions$.pipe(
        ofType(incrementAction, decrementAction),
        tap(console.log)
    ),
        {
            dispatch: false
        }
    );
}