const express = require("express");
const router = express.Router();

// MongoDB model for transactions, assuming you have a MongoDB setup
const Transaction = require("../models/transactions");

// Route to get transactions for a specific user
import { Request, Response } from "express";

router.get("/users/:userId", async (req: Request, res: Response) => {
	const userId = req.params.userId;

	try {
		// Fetch transactions for the specified user from the database
		const transactions = await Transaction.find({ userId: userId });
		res.json(transactions); // Send the transactions as a JSON response
	} catch (err: any) {
		res.status(500).json({ message: err.message }); // Send error message if fetching fails
	}
});

// Route to create a new transaction
router.post("/", async (req: Request, res: Response) => {
	const transactionData = req.body; // Get transaction data from the request body
	//TODO: Calculate shares based on dollar amount

	try {
		// Create a new transaction in the database
		const newTransaction = new Transaction(transactionData);
		await newTransaction.save();
		res.status(201).json(newTransaction); // Send the newly created transaction as a JSON response
	} catch (error) {
		res.status(400).json({ error }); // Send error message if creation fails
	}
});

export default router;
