import express from "express";
import { adminSignIn, signOut, userSignIn, userSignUp } from "../controllers/auth.controller.js";

const app = express();

app.post("/user/sign-up", userSignUp);
app.post("/user/sign-in", userSignIn);
app.post("/admin/sign-in", adminSignIn);
app.post("/user/sign-out", signOut);
app.post("/admin/sign-out", signOut);

export default app;