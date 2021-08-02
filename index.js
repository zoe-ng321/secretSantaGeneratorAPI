var express = require("express");
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
var cors = require('cors')
app.use(cors())

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

const authRoutes = require('./src/routes/auth.routes.js');
const userRoutes = require('./src/routes/user.routes.js');
const groupRoutes = require('./src/routes/group.routes.js');
const wishlistRoutes = require('./src/routes/wishlist.routes.js');
const verifyTokenRoutes = require('./src/routes/validateToken.routes.js');

app.use("/api/user", authRoutes);
app.use("/api/user", verifyTokenRoutes, userRoutes);
app.use("/api/group", verifyTokenRoutes, groupRoutes);
app.use("/api/wishlist", verifyTokenRoutes, wishlistRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`App listening on http://localhost:${PORT}`);
});
