const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const PACKAGE_JSON = require("./remove_Node_Modules");
fs.readdirSync(__dirname).forEach((folderName) => {
	if (
		!folderName.includes(".") &&
		fs.existsSync(path.join(folderName, PACKAGE_JSON))
	) {
		console.log(folderName);
		exec("npm i --prefix ./" + folderName);
	}
});
