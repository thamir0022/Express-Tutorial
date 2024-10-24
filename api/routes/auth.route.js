import express from "express";
import { adminSignIn, deleteAccount, signOut, userSignIn, userSignUp } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const app = express();

app.post("/user/sign-up", userSignUp);
app.post("/user/sign-in", userSignIn);
app.post("/admin/sign-in", adminSignIn);
app.post("/admin/sign-out", signOut);
app.post("/user/sign-out", signOut);
app.post("/user/delete/:userId?", verifyToken, deleteAccount);

export default app;