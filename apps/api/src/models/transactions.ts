// Data model for investments
import mongoose from "mongoose";
import shortId from "shortid";

const transactionsSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true },
		status: {
			type: String,
			required: true,
			default: "Pending",
			enum: ["Pending", "Approved", "Denied"],
		},
		id: { type: String, required: true, default: shortId.generate },
		dollarAmount: { type: Number, required: true },
		shares: { type: Number, required: true },
		date: { type: Date, required: true, default: Date.now },
		note: { type: String, required: false },
	},
	{ timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionsSchema);
module.exports = Transaction;
