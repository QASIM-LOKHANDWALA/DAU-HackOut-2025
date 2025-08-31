import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Registering user:", email);

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ msg: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        console.log(err);

        res.status(500).json({ msg: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Logging in user:", email);

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token, user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: err.message });
    }
});

export default router;
