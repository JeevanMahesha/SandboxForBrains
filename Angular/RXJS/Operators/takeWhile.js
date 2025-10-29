import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

const source = interval(1000);
const example = source.pipe(takeWhile(val => val < 3));
example.subscribe(val => console.log(val)); // Output: 0, 1, 2
