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
		host: "127.0.0.1",
		port: 5432,
		user: "Ojas",
		password: "2905",
		database: "smart-brain",
	},
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	res.json(dataBase.users);
});

app.post("/signin", signin.handleSignin(db, bcrypt));
app.post("/register", register.handleRegister(db, bcrypt));

app.get("/profile/:id", profile.handleProfileGet(db));

app.put("/image", image.handleImage(db));
app.post("/imageurl", image.handleImageUrl);

app.listen(3000, () => {
	console.log("app is running on port 3000");
});

/*
/ --> it's working
/signin --> POST success/fail
/register --> POST user
/profile/:userID --> GET = user
/image --> PUT -> user

*/
