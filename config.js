const path = require('path');

module.exports = {
	maxHasteLength: 1_000_000,
	maxHasteDescriptionLength: 1_000,
	maxHasteTitleLength: 100,
	port: 3000,
	templateDir: path.resolve(`${process.cwd()}${path.sep}views`),
	name: "TH",
	baseUrl: "http://haste.thdr.me",
}