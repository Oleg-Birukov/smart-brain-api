const express = require("express");
const bodyParser = require("body-parser");
const { result } = require("lodash");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
	client: "pg",
	connection: {
		host: "dpg-ceauh66n6mphc8ufgjc0-a",
		port: 5432,
		user: "smartbrain_fhgz_user",
		password: "78QRGsWIjjXDXZX06CrAQzDEz43q7XJO",
		database: "smartbrain_fhgz",
	},
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json('it is working');
});

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(db));

app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleImageUrl);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`app is running on port ${PORT}`);
});

/*
/ --> it's working
/signin --> POST success/fail
/register --> POST user
/profile/:userID --> GET = user
/image --> PUT -> user

*/
