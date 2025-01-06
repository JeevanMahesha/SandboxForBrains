import { interval } from 'rxjs';
import { map, retry } from 'rxjs/operators';

const source = interval(1000).pipe(
    map(val => {
        if (val > 3) {
            throw 'Error!';
        }
        return val;
    }),
    retry(1)
);

source.subscribe({
    next: val => console.log(val),
    error: err => console.error(err)
}
);

// Output: 0, 1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, "Error!"