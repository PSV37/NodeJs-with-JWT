const express = require('express')
const jwt = require('jsonwebtoken')

const app = express();

// Test Api
app.get('/api', (req, res) => {
	res.json({
		message:'welcome to node api'
	});
});


// Login authroization api
app.post('/api/login', (req, res) => {
	const user = {
		id:1,
		username:'sapna',
		email:'sapnapasatapure@gmail.com'
	}

	//we can add expiry time in hour, sec, days 20s, 2h, 3d
	jwt.sign({user}, 'secretkey', {expiresIn: '2h'}, (err, token) => {
		res.json({
			token
		});
	});
});



// get posts with authorization
app.post('/api/posts', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, authData) => {
		if(err){
			res.sendStatus(403);
		} else {
			res.json({
				message:'all posts',
				authData
			})			
		}
	})

});




// VerifyToken for all apis
function verifyToken(req, res, next) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	// check bearer header id undefined
	if(typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');

		const bearerToken = bearer[1];

		req.token = bearerToken;

		next();
	} else {
		// Throw Forbbiden error
		res.sendStatus(403);
	}
}


// Run port
app.listen(5000, () => {
	console.log('server start on port 5000')
})