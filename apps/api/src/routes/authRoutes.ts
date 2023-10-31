const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/users");
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

import { Request, Response } from "express";

router.post("/signup", async (req: Request, res: Response) => {
	const user = new User(req.body);
	await user.save();
	const token = jwt.sign({ userId: user._id }, process.env.YOUR_SECRET_KEY);
	res.send({ token });
});

router.post("/login", async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(422).send("Invalid email or password");
	}
	router.post("/login", (req: Request, res: Response) => {});
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return res.status(422).send("Invalid email or password");
	}
	const token = jwt.sign({ userId: user._id }, process.env.YOUR_SECRET_KEY);
	res.send({ token });
});

router.get("/users/:token", async (req: Request, res: Response) => {
	const token = req.params.token || req.headers.authorization;

	// Ensure token is provided
	if (!token) {
		return res.status(401).send("Unauthorized: No token provided");
	}

	try {
		// Verify and decode the token
		const decoded: any = jwt.verify(token, process.env.YOUR_SECRET_KEY!);
		const userId = decoded.userId;

		// Find the user by decoded userId
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).send("User not found");
		}

		res.send(user); // Send user data as response
	} catch (err) {
		res.status(401).send("Unauthorized: Invalid token");
	}
});

export default router;
