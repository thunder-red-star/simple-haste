const Utils = require('../utils/utils');
const config = require('../config');

module.exports = {
	data: {
		method: 'POST',
		name: 'create',
		description: 'Create a new haste entry',
	},
	async execute (req, res) {
		// Get name and content from request body
		const { name, content } = req.body;

		// Create new entry

	}
}