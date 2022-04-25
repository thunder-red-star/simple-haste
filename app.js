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
	let mostRecentHaste = Utils.getMostRecentHaste();
	Utils.renderTemplate(req, res, 'index', {
		mostRecentHasteName: mostRecentHaste.haste.name,
		mostRecentHasteId: mostRecentHaste.haste.id,
		mostRecentHasteDescription: mostRecentHaste.haste.description,
		// Parse the haste time to a human readable format
		mostRecentHasteTime: new Date(mostRecentHaste.haste.created).toString()
	})
});

// Handle create page
app.get('/create', (req, res) => {
	Utils.renderTemplate(req, res, 'create', {
		createStatus: "x",
		createMessage: "x"
	})
});

app.post('/create', (req, res) => {
	// Create haste
	let haste = Utils.createNewHaste(req.body.name, req.body.description, req.body.content);
	// If haste was created successfully
	if (haste.success) {
		// Redirect to haste page
		return res.redirect('/haste/' + haste.haste.id);
	} else {
		// Render create page with error message
		Utils.renderTemplate(req, res, 'create', {
			createStatus: "error",
			createMessage: "Haste could not be created: " + haste.error
		});
	}
});

// Handle code pages
app.get('/code/:id', (req, res) => {
	// Try to fetch the Haste from the database by using Utils.getHasteById
	// If it fails, return an error.
	let haste = Utils.getHasteById(req.params.id);
	if (haste.success == false) {
		return Utils.renderTemplate(req, res, 'error', {
			error: "Haste not found",
			errorCode: 404
		});
	} else {
		// If it succeeds, render the code page with the haste data
		return Utils.renderTemplate(req, res, 'code', {
			title: haste.haste.name,
			description: haste.haste.description,
			content: fs.readFileSync('./data/files/' + haste.haste.name, 'utf8'),
			id: haste.haste.id,
			createStatus: "success",
			createMessage: "Haste loaded successfully"
		});
	}
});

// Handle code but just return the content
app.get('/raw/:id', (req, res) => {
	// Try to fetch the Haste from the database by using Utils.getHasteById
	// If it fails, return an error.
	let haste = Utils.getHasteById(req.params.id);
	if (haste.success == false) {
		return Utils.renderTemplate(req, res, 'error', {
			error: "Haste not found"
		});
	} else {
		// If it succeeds, render the code page with the haste data
		res.type('text/plain');
		return res.send(fs.readFileSync('./data/files/' + haste.haste.name, 'utf8'));
	}
});

// Start server
app.listen(config.port, () => {
	console.log('Server started on port ' + config.port);
});
