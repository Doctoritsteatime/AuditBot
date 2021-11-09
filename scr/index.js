// require the files in the scr folder and export them
const readline = require('readline');
const { consoleLogFormator } = require('./console/consoleLogFormator');
const fs = require('fs');
const { ignorePathDir, ignorePathFile } = JSON.parse(fs.readFileSync('./scr/ignorePath.json'));
var pathList = fs.readdirSync('./scr/').map((dir) => './scr/' + dir);
var requireObj = {};
//
function main() {
	//
	consoleLogFormator('Started importing', true);
	while (pathList.length) {
		currentPath = pathList.shift();
		if (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory() && !ignorePathDir.includes(currentPath)) {
			pathList = pathList.concat(
				fs.readdirSync(currentPath).map(function (item) {
					return currentPath + '/' + item;
				})
			);
		} else {
			if (currentPath.endsWith('.js') && !ignorePathFile.includes(currentPath)) {
				currentPath = '.' + currentPath.substring(5);
				// console.log(currentPath);
				let objR = require(currentPath);
				Object.keys(objR).forEach((key) => {
					requireObj[key] = objR[key];
				});
			}
		}
	}

	consoleLogFormator('Finished importing', true);
	return requireObj;
}
module.exports = main();
