import { Pipe, PipeTransform } from '@angular/core';
import { priorityLevels, taskStatus } from '../common.model';

@Pipe({
  name: 'getValue',
  standalone: true,
})
export class GetValuePipe implements PipeTransform {
  transform(value: string | null, type: string): string | null {
    if (!value) {
      return null;
    }
    let transformValue = null;
    if (type === 'priority') {
      transformValue =
        priorityLevels.find((eachPriority) => eachPriority.key === value)
          ?.value ?? null;
    } else if (type === 'taskStatus') {
      transformValue =
        taskStatus.find((eachStatus) => eachStatus.key === value)?.value ??
        null;
    }
    return transformValue;
  }
}
