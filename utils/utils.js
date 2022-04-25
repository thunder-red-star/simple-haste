const fs = require('fs');
const config = require('../config');
const path = require('path');

module.exports = {
	// A collection of utility functions

	// Create a new Haste ID unique from the other IDs.
	// This is used to create unique IDs for the Haste components.
	newHasteId: function () {
		// Get the other hastes.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		// Load all the IDs and dump to array.
		let ids = [];
		let hasteIDs = Object.keys(hastes.files);
		for (let i = 0; i < hasteIDs.length; i++) {
			ids.push(hasteIDs[i]);
		}

		// Create a new ID. It should be 4 random letters long, upper and lower case.
		let newID = '';
		let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		for (let i = 0; i < 4; i++) {
			newID += letters[Math.floor(Math.random() * letters.length)];
		}

		// Check if the ID is unique.
		while (ids.includes(newID)) {
			newID = this.newHasteId();
		}

		return newID;
	},
	createNewHaste: function (name, description, content) {
		// Check if haste content length doesn't exceed the limit set in config.
		if (content.length > config.maxHasteLength) {
			return {
				success: false,
				error: 'Haste content length exceeds the limit (' + this.sizeToString(config.maxHasteLength) + ') set in config.'
			};
		}

		if (!name) {
			return {
				success: false,
				error: 'Haste name is empty.'
			};
		}

		// If there is a haste with the same name, set the new name to the old name + a number.
		let newName = name;
		let i = 1;
		while (hastes.files[newName]) {
			newName = name + " (" + i + ")";
			i++;
		}

		// Create a new file with the given name as filename and content as content.
		fs.writeFileSync('./data/files/' + newName, content);

		// Add the new haste to the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		hastes.files[newName] = {
			name: newName,
			id: this.newHasteId(),
			created: new Date().getTime(),
			updated: new Date().getTime(),
			description: description,
		};

		// Get length of haste, and edit the total content length.
		let hasteLength = content.length;
		hastes.totalSize += hasteLength;
		hastes.totalCount++;

		fs.writeFileSync('./data/db.json', JSON.stringify(hastes, null, 2));

		return {
			success: true,
			id: hastes.files[name].id
		};
	},
	updateHaste: function (id, content) {
		// Check if haste content length doesn't exceed the limit set in config.
		if (content.length > config.maxHasteLength) {
			return {
				success: false,
				error: 'Haste content length exceeds the limit (' + this.sizeToString(config.maxHasteLength) + ') set in config.'
			};
		}

		// Get the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);


		// Check if the haste exists.
		if (!hastes.files[id]) {
			return {
				success: false,
				error: 'Haste with ID ' + id + ' does not exist.'
			};
		}

		// If new haste content length is 0, return error message.
		if (content.length === 0) {
			return {
				success: false,
				error: 'New haste content length is 0, please use the delete function instead.'
			};
		}

		// Get old haste content length.
		let hasteLength = hastes.files[id].content.length;

		// Update the haste.
		hastes.files[id].content = content;
		hastes.files[id].updated = new Date().getTime();

		// Update the total content length.
		hastes.totalSize += (content.length - hasteLength);

		// Write the hastes database.
		fs.writeFileSync('./data/db.json', JSON.stringify(hastes, null, 2));

		return {
			success: true
		};
	},
	deleteHaste: function (id) {
		// Get the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		// Check if the haste exists.
		if (!hastes.files[id]) {
			return {
				success: false,
				error: 'Haste with ID ' + id + ' does not exist.'
			};
		}

		// Get old haste content length.
		let hasteLength = hastes.files[id].content.length;

		// Delete the haste.
		fs.unlinkSync('./data/files/' + hastes.files[id].name);
		delete hastes.files[id];

		// Update the total content length.
		hastes.totalSize -= hasteLength;
		hastes.totalCount--;

		// Write the hastes database.
		fs.writeFileSync('./data/db.json', JSON.stringify(hastes, null, 2));

		return {
			success: true
		};
	},
	getHasteContentById: function (id) {
		// Get the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		let haste = null;

		// Check the object of each key to see if the id matches.
		for (let key in hastes.files) {
			if (hastes.files[key].id === id) {
				haste = hastes.files[key];
				break;
			}
		}

		// Error if the haste doesn't exist.
		if (!haste) {
			return {
				success: false,
				error: 'Haste with ID ' + id + ' does not exist.'
			};
		}

		return {
			success: true,
			content: hastes.files[id].content
		};
	},
	getHasteContentByName: function (name) {
		// Get the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		let haste = null;

		// Check the object of each key to see if the name matches.
		for (let key in hastes.files) {
			if (hastes.files[key].name === name) {
				haste = hastes.files[key];
				break;
			}
		}

		// Error if the haste doesn't exist.
		if (!haste) {
			return {
				success: false,
				error: 'Haste with name ' + name + ' does not exist.'
			};
		}

		return {
			success: true,
			content: hastes.files[name].content
		};
	},
	getHasteIdByName: function (name) {
		// Get the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		let haste = null;

		// Check the object of each key to see if the name matches.
		for (let key in hastes.files) {
			if (hastes.files[key].name === name) {
				haste = hastes.files[key];
				break;
			}
		}

		// Error if the haste doesn't exist.
		if (!haste) {
			return {
				success: false,
				error: 'Haste with name ' + name + ' does not exist.'
			};
		}

		return {
			success: true,
			id: hastes.files[name].id
		};
	},
	getHasteById: function (id) {
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		let haste = null;

		// Check the object of each key to see if the id matches.
		for (let key in hastes.files) {
			if (hastes.files[key].id === id) {
				haste = hastes.files[key];
				break;
			}
		}

		if (!haste) {
			return {
				success: false,
				error: 'Haste with ID ' + id + ' does not exist.'
			};
		}

		return {
			success: true,
			haste: haste
		};
	},
	getTotalSize: function () {
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		return {
			success: true,
			totalSize: hastes.totalSize
		};
	},
	getTotalCount: function () {
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		return {
			success: true,
			totalCount: hastes.totalCount
		}
	},
	sizeToString: function (size) {
		// Convert size to units of bytes, kilobytes, megabytes, and so on.
		let sizeUnits = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

		// Find the largest unit that the size is greater than or equal to.
		let i = 0
		while (size >= 1000) {
			size /= 1000
			i++
		}

		// Round the size to two decimal places.
		size = Math.round(size * 100) / 100

		// Return the size and the unit.
		return size + " " + sizeUnits[i]
	},
	renderTemplate: function (req, res, template, data = {}) {
		const baseData = {
			totalCount: this.getTotalCount().totalCount,
			totalSize: this.sizeToString(this.getTotalSize().totalSize),
			name: config.name
		};
		res.render(path.resolve(`${config.templateDir}${path.sep}${template}`), Object.assign(baseData, data));
	}
}
