var express = require("express");
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require('dotenv').config();

const mongoose = require('mongoose');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iirkt.mongodb.net/secretSantaGenerator?retryWrites=true&w=majority`;

mongoose.connect(uri, {
	useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.get("/", (req, res, next) => {
 res.json({"message": "Welcome to SecretSantaGenerator!"});
});

require('./src/routes/user.routes.js')(app);

app.listen(8000, () => {
 console.log("Server running on port 8000");
});
