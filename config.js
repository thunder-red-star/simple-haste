const path = require('path');

module.exports = {
	maxHasteLength: 1_000_000,
	port: 3000,
	templateDir: path.resolve(`${process.cwd()}${path.sep}views`)
}