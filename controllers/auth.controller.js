import User from "../models/user.model.js";
import bcyrptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSignUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter all required fields",
      });
    }

    const excistingUser = await User.findOne({ email });

    if (excistingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
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
    res.status(500).json({ error: error.message });
  }
};

export const userSignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All feilds are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isValid = await bcyrptjs.compareSync(password, user.password);

    const { password: pass, ...rest } = user._doc;

    if (isValid) {
      const token = jwt.sign({ id: user._id, isAdmin: false}, process.env.JWT_SECRET, {expiresIn: "7d"});
      const { password: pass, ...rest } = user._doc;
  
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
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

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isValid = await bcyrptjs.compareSync(password, user.password);

    const { password: pass, ...rest } = user._doc;

    if (isValid) {
      const token = jwt.sign({ id: user._id, isAdmin: true}, process.env.JWT_SECRET, {expiresIn: "7d"});
      const { password: pass, ...rest } = user._doc;
  
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
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
