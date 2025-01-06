import { from } from 'rxjs';
import { filter } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
const example = source.pipe(filter(val => val % 2 === 0));
example.subscribe(val => console.log(val)); // Output: 2, 4
