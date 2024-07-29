const mongoose = require('mongoose');

// Replace with your actual MongoDB URI
const mongoURI = "mongodb+srv://<username>:<password>@cluster0.vzsyypy.mongodb.net/sarthakdb?retryWrites=true&w=majority&appName=Cluster0";

const con = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connection Successfully.."))
.catch((err) => console.log(err));

module.exports = con;
