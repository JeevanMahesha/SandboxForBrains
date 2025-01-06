import { from } from 'rxjs';

const array = [1, 2, 3, 4, 5];
const example = from(array);
example.subscribe(val => console.log(val)); // Output: 1, 2, 3, 4, 5
