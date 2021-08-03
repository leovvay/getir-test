require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');


const { MongoClient } = require('mongodb');

const routes = require('./routes');

const port = process.env.PORT;

var db;

MongoClient.connect(process.env.DB_URI, async function(err, client) {
	if (err) {
		throw err;
	}
	else {
		db = client.db(process.env.DB_NAME);
		await createServer();
	}
});

async function createServer() {	
	const app = express();
	app.use(function(req, res, next) {
		req.db = db;
		next();
	});
	app.use(bodyParser.urlencoded({ extended: false }))
	
	// parse application/json
	app.use(bodyParser.json())
	
	app.post('/', routes.getRecords);
	
	app.listen(port, () => {});

	return app;
}


module.exports = createServer;