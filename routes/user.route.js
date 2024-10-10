import express from "express";
import { homePage } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express();

app.get("/home", verifyToken, homePage);

export default app;
