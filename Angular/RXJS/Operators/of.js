import { of } from 'rxjs';

const example = of(1, 2, 3, 4, 5);
example.subscribe(val => console.log(val)); // Output: 1, 2, 3, 4, 5
