import { interval } from 'rxjs';
import { take } from 'rxjs/operators';

const source = interval(1000);
const example = source.pipe(take(5));
example.subscribe(val => console.log(val)); // Output: 0, 1, 2, 3, 4
