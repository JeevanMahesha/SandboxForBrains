abstract class Department {
	// name: string;
	static fiscalYear = 2022;
	protected employees: string[] = [];

	// constructor(userName: string) {
	// 	this.name = userName;
	// }

	constructor(protected readonly id: string, public name: string) {}

	abstract describe(this: Department): void;

	addEmployee(employee: string): void {
		this.employees.push(employee);
	}

	printEmployeeInformation() {
		console.log(this.employees.length);
		console.log(this.employees);
	}
}

// const userOne = new Department("001", "Jeevan");

// userOne.addEmployee("EMP1");
// userOne.addEmployee("EMP2");
// userOne.printEmployeeInformation();

// userOne.describe();

// console.log(userOne);
// static can be used class name
console.log(Department.fiscalYear);

class ITDepartment extends Department {
	describe(): void {
		console.log("IT Department ID : ", this.id);
	}
	admins: string[] = [];
	constructor(id: string, admins: string[]) {
		super(id, "IT");
		this.admins = admins;
	}
}

const ITDepartment1 = new ITDepartment("002222222222", ["READ"]);

ITDepartment1.describe();

console.log(ITDepartment1);

class AccountingDepartment extends Department {
	private lastReport: string;

	private static instance: AccountingDepartment;

	get mostRecentReport(): string {
		if (this.lastReport) {
			return this.lastReport;
		}
		throw new Error("Unable to fetch the last report");
	}

	static getInstance() {
		if (!this.instance) {
			this.instance = new AccountingDepartment("003", []);
		}
		return this.instance;
	}

	set mostRecentReport(text: string) {
		if (!text) {
			throw new Error("Please pass in a valid value!");
		}
		this.addReport(text);
	}

	private constructor(id: string, private reports: string[]) {
		super(id, "Account");
		this.lastReport = reports[reports.length - 1];
	}

	describe(): void {
		console.log("Accounting ID : ", this.id);
	}

	addEmployee(employee: string): void {
		if (employee === "EMP1") {
			return;
		}
		this.employees.push(employee);
	}

	addReport(text: string) {
		this.reports.push(text);
		this.lastReport = text;
	}

	printReports() {
		console.log(this.reports);
	}
}

// const account001 = new AccountingDepartment("003", []);

const account001 = AccountingDepartment.getInstance();

account001.addEmployee("EMP1");
account001.addEmployee("EMP2");

account001.addReport("REPORT TEXT");
account001.mostRecentReport = "Report TEXT-2";
// console.log(account001.mostRecentReport);
// account001.printReports();
// account001.printEmployeeInformation();

account001.describe();

console.log(account001);
