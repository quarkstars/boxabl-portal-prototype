import { createServer } from "./server";
import { log } from "logger";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3001;
const server = createServer();

const uri = process.env.MONGODB_CONNECTION_STRING!;
mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
} as mongoose.ConnectOptions);
server.listen(port, () => {
	log(`api running on ${port}`);
});
