const mongoose = require("mongoose");
const Place = require("../models/place")
const data = require("./sampledata")

const MONGO_URI = 'mongodb://127.0.0.1:27017/bookme'

main()
    .then((res) => {
        console.log("MongoDB is Connected");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URI);
}

async function initDB(){
    await Place.deleteMany({});
    await Place.insertMany(data.data)
}

initDB(); 