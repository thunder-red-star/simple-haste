const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');
const config = require('./config');
const Utils = require('./utils/utils');

// Read endpoints directory
let endpoints = fs.readdirSync('./endpoints');

// Add all middleware
app.use(bodyParser.json({ limit: "100mb" }))
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 100000 }))
app.use(express.static('public'));

// Set view engine
app.set('view engine', 'ejs');

// Handle all api endpoints
for (let endpoint of endpoints) {
	let endpointData = require('./endpoints/' + endpoint);
	if (endpointData.data.method == "POST") {
		app.post('/api/' + endpointData.data.name, (req, res) => {
			return endpointData.execute(req, res);
		});
		// Handle GET requests to POST endpoints
		app.get('/api/' + endpointData.data.name, (req, res) => {
			// Return 500 with error message
			return res.status(500).json({
				success: false,
				error: "GET requests are not allowed for POST endpoints"
			});
		});
	} else if (endpointData.data.method == "GET") {
		app.get('/api/' + endpointData.data.name, (req, res) => {
			return endpointData.execute(req, res);
		});
	}
}

// Handle index page
app.get('/', (req, res) => {
	Utils.renderTemplate(req, res, 'index')
});

// Start server
app.listen(config.port, () => {
	console.log('Server started on port ' + config.port);
});