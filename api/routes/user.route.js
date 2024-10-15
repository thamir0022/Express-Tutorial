import express from "express";
import { getProduct, getProducts, homePage } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express();

app.get("/home", verifyToken, homePage);
app.get("/product/:id?", getProduct);
app.get("/products", getProducts);

export default app;
