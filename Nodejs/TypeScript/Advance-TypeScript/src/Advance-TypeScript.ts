// Code goes here!

type Admin = {
	name: string;
	privileges: string[];
};

type Employee = {
	name: string;
	startDate: Date;
};

// ? Intersection type
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
	name: "Max",
	privileges: ["create-server"],
	startDate: new Date(),
};

interface IAdmin {
	name: string;
	privileges: string[];
}

interface IEmployee {
	name: string;
	startDate: Date;
}

interface IElevatedEmployee extends IAdmin, IEmployee {}

const e2: IElevatedEmployee = {
	name: "jeevan",
	privileges: ["create-server"],
	startDate: new Date(),
};
// ! Type Guards
type UnknownEmployee = Employee | Admin;

/**
 * "If the object has a property called privileges, then print it out."
 *
 * The in operator is used to check if a property exists in an object
 * @param {UnknownEmployee} emp - UnknownEmployee - This is the parameter that we're passing into the
 * function.
 */
function printEmployeeInformation(emp: UnknownEmployee) {
	console.log("Name " + emp.name);
	// ? in is used to check the property exist in the object or not
	if ("privileges" in emp) {
		console.log("Privileges " + emp.privileges);
	}

	if ("startDate" in emp) {
		console.log("Start Date " + emp.startDate);
	}
}

printEmployeeInformation(e2);
// printEmployeeInformation({ name: "dummy", startDate: new Date() });

class Car {
	drive() {
		console.log("Driving a car........");
	}
}
class Truck {
	drive() {
		console.log("Driving a Truck........");
	}

	loadCargo(amount: number) {
		console.log("Load Cargo " + amount);
	}
}

const v1 = new Car();
const v2 = new Truck();

type Vehicle = Car | Truck;

function useVehicle(vehicle: Vehicle) {
	vehicle.drive();
	// ? instanceof can be used only when we have Class
	if (vehicle instanceof Truck) {
		vehicle.loadCargo(5000);
	}
}

useVehicle(v1);
useVehicle(v2);

interface Bird {
	type: "bird"; // littoral type
	flyingSpeed: number;
}

interface Horse {
	type: "horse"; // littoral type and here type is user define
	runningSpeed: number;
}

type Animal = Bird | Horse;

function animalMovement(animal: Animal) {
	// if ("flyingSpeed" in animal) {
	// 	console.log("Speed is " + animal.flyingSpeed);
	// }
	let Speed;
	switch (animal.type) {
		case "bird":
			Speed = animal.flyingSpeed;
			break;
		case "horse":
			Speed = animal.runningSpeed;
			break;
		default:
			break;
	}
	console.log("Speed is " + Speed);
}

const bird: Bird = {
	flyingSpeed: 20,
	type: "bird",
};

const horse: Horse = {
	runningSpeed: 200,
	type: "horse",
};

animalMovement(bird);
animalMovement(horse);

const userInputMessage = <HTMLInputElement>document.getElementById("message")!;
// const userInputMessage = (document.getElementById('message') as HTMLInputElement )!

userInputMessage.value = "Hi everyone";

// Dynamic Key Value interface it's called index property
interface ErrorContainer {
	[prop: string]: string;
}

// Function Overload
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any) {
	if (typeof a === "string" && typeof b === "string") {
		return [a, b].join();
	}
	return a + b;
}

// Nullish Coalescing

const userInput = null;

// if the userInput is null / undefine / empty string the default value will be served
const storeData = userInput ?? "Default Value";

console.log(storeData);
