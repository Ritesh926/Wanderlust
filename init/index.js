const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const data = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: '686cfc0b70fd6b655c46a0e3'})); // Replace with actual owner ID
  // Ensure that the owner field is set to a valid ObjectId
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();