import { isValidObjectId } from "mongoose";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const updateUser = async (req, res) => {
  try {
    if(!req.params.userId){
      return res.json({
        success: false,
        message: "User Id is required!",
      });
    }
    if (req.user.id !== req.params.userId) {
      return res.json({
        success: false,
        message: "You don't have permission to update this user.",
        params: req.params.userId,
        user: req.user.id
      });
    }

    const { firstName, lastName, email, password } = req.body;
    if (firstName?.length > 10 || lastName?.length > 10) {
      return res.json({
        success: false,
        message: "First name and last name should under 10 characters!",
      });
    }

    if (password?.length < 6) {
      return res.json({
        success: false,
        message: "Password must between 6 to 12 characters long!",
      });
    }

    if (password?.includes(" ")) {
      return res.json({
        success: false,
        message: "Password should not contain spaces",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          firstName,
          lastName,
          email,
          password,
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: "Id is required!" });
    }
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Id is not valid" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product is not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    // Extract query parameters
    const { name, category, price, search } = req.query;

    // Create a filter object based on available query parameters
    let filter = {};

    if (search) {
      // General search across all fields: name, category, description, price
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        // Only include price in the search if search is a valid number
        ...(isNaN(parseFloat(search)) ? [] : [{ price: parseFloat(search) }]),
      ];
    } else {
      // Specific queries for name, category, price
      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }
      if (category) {
        filter.category = { $regex: category, $options: "i" };
      }
      if (price) {
        filter.price = parseFloat(price);
      }
    }

    // Find products based on filter, or return all if no filters are provided
    const products = await Product.find(filter).sort({ updatedAt: -1 });

    // Handle case where no products match the query
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products match your search",
      });
    }

    // Return the filtered products
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
