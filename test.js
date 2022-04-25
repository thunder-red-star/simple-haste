const Axios = require('axios');

// Create a new Haste by POSTing to the Haste API

(async () => {
	let response = await Axios.post('http://localhost:3000/api/create', {
		name: 'test2',
		content: 'console.log("Hello World!");',
	});
	console.log(response.data);
})();