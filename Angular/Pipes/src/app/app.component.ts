import { Component } from "@angular/core";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"],
})
export class AppComponent {
	appStatus = new Promise<string>((resolve, reject) => {
		setTimeout(() => {
			resolve("stable");
		}, 3000);
	});
	filteredStatus = null;
	servers = [
		{
			instanceType: "medium",
			name: "Production Server",
			status: "stable",
			started: new Date(15, 1, 2017),
		},
		{
			instanceType: "large",
			name: "User Database",
			status: "stable",
			started: new Date(15, 1, 2017),
		},
		{
			instanceType: "small",
			name: "Development Server",
			status: "offline",
			started: new Date(15, 1, 2017),
		},
		{
			instanceType: "small",
			name: "Testing Environment Server",
			status: "stable",
			started: new Date(15, 1, 2017),
		},
	];
	getStatusClasses(server: {
		instanceType: string;
		name: string;
		status: string;
		started: Date;
	}): { [s: string]: boolean } {
		return {
			"list-group-item-success": server.status === "stable",
			"list-group-item-warning": server.status === "offline",
			"list-group-item-danger": server.status === "critical",
		};
	}

	addServer(): void {
		this.servers.push({
			instanceType: "X-small",
			name: "DEV Temp Environment Server",
			status: "stable",
			started: new Date(15, 1, 2022),
		});
	}
}
