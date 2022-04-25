const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');
const config = require('./config');

// Read endpoints directory
let endpoints = fs.readdirSync('./endpoints');

// Add all middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');

// Handle all endpoints
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

// Start server
app.listen(config.port, () => {
	console.log('Server started on port ' + config.port);
});