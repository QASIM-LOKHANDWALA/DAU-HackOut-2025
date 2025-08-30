import mongoose from "mongoose";

const plantSchema = new mongoose.Schema({
    name: String,
    capcity: Number,
    endUse: String,
    consumption: Number,
    Latitude: Number,
    Longitude: Number,
    location: String,
});

const Plant = mongoose.model(
    "energy_plants",
    new mongoose.Schema({}, { strict: false })
);

export default Plant;
