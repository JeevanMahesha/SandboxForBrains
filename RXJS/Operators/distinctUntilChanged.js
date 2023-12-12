import { of } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const source = of(1, 1, 2, 2, 3, 3, 4, 5, 5);
const example = source.pipe(distinctUntilChanged());
example.subscribe(val => console.log(val)); // Output: 1, 2, 3, 4, 5
