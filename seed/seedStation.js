// Adds a few starting stations to the database.
// Run it with: npm run seed
import "dotenv/config";
import mongoose from "mongoose";
import Station from "../models/Station.js";

const stations = [
  { name: "Sadat", location: "Tahrir Square, Cairo" },
  { name: "Attaba", location: "Downtown Cairo" },
  { name: "Shubra El Kheima", location: "Shubra, Qalyubia" },
];

const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/metrosync";

await mongoose.connect(uri);

const count = await Station.countDocuments();
if (count > 0) {
  console.log("There are already " + count + " stations, so I did not add more.");
} else {
  await Station.insertMany(stations);
  console.log("Added " + stations.length + " stations.");
}

await mongoose.disconnect();
