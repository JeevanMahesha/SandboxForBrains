import { from } from 'rxjs';
import { scan } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
const example = source.pipe(scan((acc, val) => acc + val, 0));
example.subscribe(val => console.log(val)); // Output: 1, 3, 6, 10, 15
