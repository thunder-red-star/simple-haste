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
		const { name, description, content } = req.body;

		// Create new entry
		const entry = await Utils.createNewHaste(name, description, content);

		// Check if successful
		if (entry.success) {
			// Send success response
			res.status(200).json({
				success: true,
				message: 'Entry created successfully.',
				id: entry.id,
			});
		} else {
			// Send error response
			res.status(500).json({
				success: false,
				message: 'Error creating entry: ' + entry.error,
			});
		}
	}
}