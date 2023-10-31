import { json, urlencoded } from "body-parser";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import transactionRouter from "./routes/transactionRoutes";

export const createServer = () => {
	const app = express();
	app
		.disable("x-powered-by")
		.use(morgan("dev"))
		.use(urlencoded({ extended: true }))
		.use(json())
		.use(cors())
		.get("/message/:name", (req, res) => {
			return res.json({ message: `hello ${req.params.name}` });
		})
		.get("/healthz", (req, res) => {
			return res.json({ ok: true });
		});
	app.use("/api/auth", authRouter);
	app.use("/api/transactions", transactionRouter);

	return app;
};
