import { FormControl } from '@angular/forms';

export interface ITaskFrom {
  id: FormControl<string | null>;
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  priority: FormControl<string | null>;
  taskStatus: FormControl<string | null>;
  dueDate: FormControl<Date | null>;
}
