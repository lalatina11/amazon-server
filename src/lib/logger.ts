import winston from "winston";
import { env } from "./env.js";

const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
	level: env.NODE_ENV !== "production" ? "debug" : "http",
	format: combine(timestamp(), errors({ stack: true }), json()),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "logs/error.log", level: "error" }),
	],
});

export default logger;
