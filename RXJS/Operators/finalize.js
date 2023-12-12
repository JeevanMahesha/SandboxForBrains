import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';

const source = of('Finalizing!');
const example = source.pipe(finalize(() => console.log('Finalized!')));
example.subscribe(val => console.log(val)); // Output: 'Finalizing!', 'Finalized!'
