import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import plantRoutes from "./routes/plantRoute.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/plants", plantRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/demo").then(() => {
    console.log("db connected");
});

app.listen(8080, () => {
    console.log("Server connected");
});
