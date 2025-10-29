const names: Array<string> = []; // string[]

const promise: Promise<string> = new Promise((resolve, _reject) => {
	setTimeout(() => {
		resolve("This is Finished");
	}, 2000);
});

// =============================================================================================

// extends refers the type of T / U must be Object
function merge<T extends object, U extends object>(
	objectA: T,
	objectB: U
): T & U {
	return Object.assign(objectA, objectB);
}

/* 

? This is once way 

function merge<T, U>(objectA: T, objectB: U): T & U {
	return Object.assign({}, objectA, objectB);
}
 */
const mergedObj = merge({ name: "NAME" }, { age: 20 });

// console.log(mergedObj);

interface ILengthy {
	length: number;
}

function countAndPrint<T extends ILengthy>(element: T): [T, string] {
	let descriptionText = "Length is 0";
	if (element.length > 0) {
		descriptionText = "Length is " + element.length;
	}
	return [element, descriptionText];
}

console.log(countAndPrint("Jeevan"));

/* 

? keyof is used to set a constrain that T object will have the property which U value

*/
function extractConvert<T extends object, U extends keyof T>(obj: T, key: U) {
	return obj[key];
}

console.log(extractConvert({ name: "jeevan" }, "name"));

class DataStorage<T extends string | number> {
	private data: Array<T> = [];

	addItem(item: T) {
		this.data.push(item);
	}

	removeItem(item: T) {
		this.data.splice(this.data.indexOf(item), 1);
	}

	getItem() {
		return this.data.slice();
	}
}

const textStorage = new DataStorage<string>();

textStorage.addItem("Jeevan");
textStorage.addItem("Jeevan1");
textStorage.addItem("Jeevan2");
console.log(textStorage.getItem());
textStorage.removeItem("Jeevan2");
console.log(textStorage.getItem());

const numberStorage = new DataStorage<number>();

numberStorage.addItem(1);
numberStorage.addItem(3);
numberStorage.addItem(2);
console.log(numberStorage.getItem());
numberStorage.removeItem(3);
console.log(numberStorage.getItem());

// const objectStorage = new DataStorage<object>();

// objectStorage.addItem({ name: "jeevan" });
// objectStorage.addItem({ name: "jeevan1" });
// objectStorage.addItem({ name: "jeevan2" });
// console.log(objectStorage.getItem());
// objectStorage.removeItem({ name: "jeevan3" });
// console.log(objectStorage.getItem());

// Generic Utility Types
interface CourseGoal {
	title: string;
	description: string;
	completeData: Date;
}

// function createCourseGoal(
// 	title: string,
// 	description: string,
// 	completeData: Date
// ): CourseGoal {
// 	let courseGoal: CourseGoal = {
// 		title: "",
// 		description: "",
// 		completeData: new Date(),
// 	};
// 	courseGoal.title = title;
// 	courseGoal.description = description;
// 	courseGoal.completeData = completeData;

// 	return courseGoal;
// }

function createCourseGoal(
	title: string,
	description: string,
	completeData: Date
): CourseGoal {
	/* 
	 Partial this will make the interface value optional by default but when you return / pass that value from
	 variable make sure you have type casted it
	 */
	let courseGoal: Partial<CourseGoal> = {};
	courseGoal.title = title;
	courseGoal.description = description;
	courseGoal.completeData = completeData;

	return <CourseGoal>courseGoal;
}

const readOnlyNames: ReadonlyArray<string> = ["jeevan", "jeevan1"];
/* 
this will throw an error as it's readonly
readOnlyNames.push("jeevan3");
 */
