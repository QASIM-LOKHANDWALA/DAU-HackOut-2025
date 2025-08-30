import express from "express";
import Plant from "../models/plantSchema.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const plants = await Plant.find();
        res.json(plants);
    } catch (error) {
        console.log(error);
    }
});
export default router;
