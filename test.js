const Axios = require('axios');

// Create a new Haste by POSTing to the Haste API

(async () => {
	let response = await Axios.post('http://localhost:3000/api/create', {
		name: 'bruh',
		content: "I'm a haste".repeat(18294),
	});
	console.log(response.data);
})();