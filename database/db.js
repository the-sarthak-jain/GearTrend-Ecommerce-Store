const mongoose = require('mongoose');
require('dotenv').config();

// Replace with your actual MongoDB URI
const mongoURI = process.env.MONGO_URI;

const con = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connection Successfully.."))
.catch((err) => console.log(err));

module.exports = con;
