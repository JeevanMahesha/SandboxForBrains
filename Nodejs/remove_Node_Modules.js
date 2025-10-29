const fs = require("fs");
const path = require("path");
const PACKAGE_LOCK_JSON = "package-lock.json";
const PACKAGE_JSON = "package.json";
const isPackageLockJson = true;
fs.readdirSync(__dirname).forEach((folderName) => {
	let node_modules = path.join(folderName, "node_modules");
	if (
		!folderName.includes(".") &&
		fs.existsSync(path.join(folderName, PACKAGE_JSON))
	) {
		if (isPackageLockJson) {
			let package_lock_json = path.join(folderName, PACKAGE_LOCK_JSON);
			if (fs.existsSync(package_lock_json)) {
				fs.unlinkSync(package_lock_json, { recursive: true });
			}
		}
		if (fs.existsSync(node_modules)) {
			fs.rmSync(node_modules, { recursive: true });
		}
		console.log(folderName);
	}
});
console.log("DONE");

module.exports = PACKAGE_JSON;
