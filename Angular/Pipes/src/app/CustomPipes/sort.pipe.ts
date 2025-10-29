import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
	name: "sort",
	pure: false,
})
export class SortPipe implements PipeTransform {
	transform(value: any, propName: string): any {
		if (!value.length || !propName) {
			return value;
		}
		return value.sort((a, b) => a[propName].localeCompare(b[propName]));
	}
}
