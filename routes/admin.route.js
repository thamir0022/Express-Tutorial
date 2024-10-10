import express from "express";
import { addProduct } from "../controllers/admin.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express();

app.post("/add-product", verifyToken ,addProduct);

export default app;
