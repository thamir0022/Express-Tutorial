import express from "express";
import { getProduct, getProducts, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express();

app.get("/product/:id?", getProduct);
app.get("/products", getProducts);
app.post("/update/:userId?", verifyToken, updateUser)

export default app;
