const fs = require('fs');
const config = require('../config');


module.exports = {
	// A collection of utility functions

	// Create a new Haste ID unique from the other IDs.
	// This is used to create unique IDs for the Haste components.
	newHasteId: function() {
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
	createNewHaste: function(name, description, content) {
		// Check if haste content length doesn't exceed the limit set in config.
		if (content.length > config.maxHasteLength) {
			return {
				success: false,
				error: 'Haste content length exceeds the limit (' + config.maxHasteLength + ') set in config.'
			};
		}

		// Create a new file with the given name as filename and content as content.
		fs.writeFileSync('./data/files/' + name, content);

		// Add the new haste to the hastes database.
		let hastes = fs.readFileSync('./data/db.json', {encoding: 'utf8'});
		hastes = JSON.parse(hastes);

		hastes.files[name] = {
			name: name,
			id: this.newHasteId(),
			created: new Date().getTime(),
			updated: new Date().getTime(),
			description: description,
		};

		fs.writeFileSync('./data/db.json', JSON.stringify(hastes));

		return {
			success: true,
			id: hastes.files[name].id
		};
	},
	updateHaste: function(id, content) {
		// Check if haste content length doesn't exceed the limit set in config.
		if (content.length > config.maxHasteLength) {
			return {
				success: false,
				error: 'Haste content length exceeds the limit (' + config.maxHasteLength + ') set in config.'
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

		// Update the haste.
		hastes.files[id].content = content;
		hastes.files[id].updated = new Date().getTime();

		// Write the hastes database.
		fs.writeFileSync('./data/db.json', JSON.stringify(hastes));

		return {
			success: true
		};
	},
	deleteHaste: function(id) {
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

		// Delete the haste.
		fs.unlinkSync('./data/files/' + hastes.files[id].name);
		delete hastes.files[id];

		// Write the hastes database.
		fs.writeFileSync('./data/db.json', JSON.stringify(hastes));

		return {
			success: true
		};
	},
	getHasteContentById: function(id) {
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
	}
}