// Data model for users who can log in to the app
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const usersSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		phoneNumber: { type: Number, required: true },
		isCanadian: { type: Boolean, required: true },
		isAccredited: { type: Boolean, required: true },
	},
	{ timestamps: true }
);

usersSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});

const User = mongoose.model("User", usersSchema);
module.exports = User;
