interface IGreet {
	greet(): void;
}

interface IPerson extends IGreet {
	name: string;
	readonly age: number;
}

class Person implements IPerson {
	name: string;
	age: number;

	constructor(n: string, a: number) {
		this.name = n;
		this.age = a;
	}

	greet(): void {
		console.info(this.name + " Welcome");
	}
}

type addFun = (a: number, b: number) => number;

interface IAddFun {
	(a: number, b: number): number;
}

let addFunction: addFun;
let IAddFunction: IAddFun;

addFunction = (n1: number, n2: number) => n1 + n2;
IAddFunction = (n1: number, n2: number) => n1 + n2;
