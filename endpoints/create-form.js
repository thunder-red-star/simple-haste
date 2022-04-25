const Utils = require('../utils/utils');
const config = require('../config');

module.exports = {
    data: {
        method: 'POST',
        name: 'create-form',
        description: 'Create a new haste entry coming from the form.',
    },
    async execute (req, res) {
        // Get name and content from request body
        const { name, description, content } = req.body;

        // Create new entry
        const entry = await Utils.createNewHaste(name, description, content);

        // Check if successful
        if (entry.success) {
            // Send success response
            res.redirect(`${config.baseUrl}/code/${entry.id}`);
        } else {
            // Send error response
            res.status(500).json({
                success: false,
                message: 'Error creating entry: ' + entry.error,
            });
        }
    }
}