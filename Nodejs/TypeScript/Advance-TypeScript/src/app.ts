/**
 * "The Logger function takes a string and returns a function that takes a constructor and logs the
 * string."
 *
 * The Logger function is a factory function that returns a function.
 *
 * The returned function is a decorator.
 *
 * The decorator takes a constructor and logs the string
 * @param {string} logString - string - This is the string that we want to log out.
 * @returns A function that takes a constructor function as an argument.
 */
function Logger(logString: string) {
	return (constructor: Function) => {
		console.log(logString);
		console.log(constructor);
	};
}

/**
 * It takes a template string and a hookId string as arguments, and returns a function that takes a
 * constructor as an argument
 * @param {string} templet - string - The HTML template to use.
 * @param {string} hookId - The id of the element in the DOM that we want to render the component to.
 * @returns A function that takes a constructor and returns a function that takes a constructor.
 */
function WithTemplate(templet: string, hookId: string) {
	console.log("withTemplet");

	return (constructor: any) => {
		const hookEle = document.getElementById(hookId);
		if (hookEle) {
			hookEle.innerHTML = templet;
			const p = new constructor();
			hookEle.querySelector("h1")!.textContent = p.name;
		}
	};
}

@Logger("Person")
@WithTemplate("<h1>My Person Object</h1>", "app")
class Person {
	name = "Jeevan";
	constructor() {
		console.log("Creating Person object.....");
	}
}

const p1 = new Person();

// console.log(p1);

function Log(target: any, propertyName: string | Symbol) {
	console.log("Property Decorator");
	console.log(target, propertyName);
}

function Log2(
	target: any,
	AccessorName: string | Symbol,
	AccessorDescriptor: PropertyDescriptor
) {
	console.log("Accessor Decorator....");
	console.log(target, AccessorName, AccessorDescriptor);
}

function Log3(
	target: any,
	methodName: string | Symbol,
	methodDescriptor: PropertyDescriptor
) {
	console.log("Method Decorator....");
	console.log(target, methodName, methodDescriptor);
}

function Log4(target: any, methodName: string | Symbol, position: number) {
	console.log("Parameter Decorator....");
	console.log(target, methodName, position);
}

class Product {
	@Log
	title: string | undefined;
	constructor(title: string, private price: number) {
		this.title = title;
	}

	@Log2
	set priceValue(val: number) {
		if (val <= 0) {
			throw new Error("Invalid Price");
		}
		this.price = val;
	}

	@Log3
	getPriceWithTax(@Log4 tax: number): number {
		return this.price * (1 + tax);
	}
}

interface ValidatorConfig {
	[property: string]: {
		[validateProp: string]: string[];
	};
}

const registeredValidators: ValidatorConfig = {};

function Require(target: any, propertyName: string) {
	registeredValidators[target.constructor.name] = {
		...registeredValidators[target.constructor.name],
		[propertyName]: ["required"],
	};
}

function PositiveNumber(target: any, propertyName: string) {
	registeredValidators[target.constructor.name] = {
		...registeredValidators[target.constructor.name],
		[propertyName]: ["positive"],
	};
}

function Validate(obj: any): boolean {
	const objValidatorConfig = registeredValidators[obj.constructor.name];
	if (!objValidatorConfig) {
		return true;
	} else {
		let isValid = true;
		for (const prop in objValidatorConfig) {
			for (const validator of objValidatorConfig[prop]) {
				switch (validator) {
					case "required":
						isValid = isValid && !!obj[prop];
						break;
					case "positive":
						isValid = isValid && obj[prop] > 0;
						break;
				}
			}
		}
		return isValid;
	}
}

class Course {
	@Require
	title: string;
	@PositiveNumber
	price: number;

	constructor(t: string, p: number) {
		this.title = t;
		this.price = p;
	}
}

setTimeout(() => {
	const createdCourse = new Course("Jeevan", -2);
	// const createdCourse = new Course("", 0);
	console.log(createdCourse);
	if (!Validate(createdCourse)) {
		alert("Invalid input");
		return;
	}
}, 2000);
