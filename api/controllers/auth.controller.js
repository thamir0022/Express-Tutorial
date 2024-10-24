import User from "../models/user.model.js";
import bcyrptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";
import { errorHandler } from "../utils/error.js";

export const userSignUp = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return next(errorHandler(400, "Please enter all required fields"));
    }

    const excistingUser = await User.findOne({ email });

    if (excistingUser) {
      return next(errorHandler(400, "User already exists"));
    }

    const hashedPassword = await bcyrptjs.hashSync(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: true, message: "SignUp Success", newUser });
  } catch (error) {
    return next(errorHandler(400, error.message));
  }
};

export const userSignIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required!"))
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User not found")); 
    }

    const isValid = await bcyrptjs.compareSync(password, user.password);

    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    const { password: pass, ...rest } = user._doc;

    const token = jwt.sign(
      { id: user._id, isAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const adminSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All feilds are required" });
    }

    const admin = await User.findOne({ email, isAdmin: true });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found or wrong cretintials",
      });
    }

    const isValid = await bcyrptjs.compareSync(password, admin?.password);

    if (!isValid) {
      return res.status(404).json({
        success: false,
        message: "Admin cretintials are not valid",
      });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password: pass, ...rest } = admin._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const signOut = (req, res) => {
  try {
    res.clearCookie("access_token"); // Clears the "access_token" cookie set in the signIn function
    return res.status(200).json({ message: "Sign Out Success" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.json({ success: false, message: "User Id is required" });
    }

    if (!isValidObjectId(userId)) {
      return res.json({ success: false, message: "User Id is invalid" });
    }

    if (req.user.id !== userId) {
      return res.json({
        success: false,
        message: "You don't have permission to delete this user.",
      });
    }

    await User.findByIdAndDelete(userId);
    return res.json({ success: true, message: "Account Deleted!" });
  } catch (error) {
    console.log(error);
  }
};
