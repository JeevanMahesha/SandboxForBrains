import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const source = from([1, 2, 3, 4, 5]);
const example = source.pipe(map(val => val * 10));
example.subscribe(val => console.log(val)); // Output: 10, 20, 30, 40, 50
