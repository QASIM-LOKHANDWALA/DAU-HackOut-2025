import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import plantRoutes from "./routes/plantRoute.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/plants", plantRoutes);

mongoose.connect("mongodb://localhost:27017/demo").then(() => {
    console.log("db connected");
});

app.listen(8000, () => {
    console.log("Server connected");
});
