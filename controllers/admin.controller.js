import Product from "../models/product.model.js";

export const addProduct = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.json({ success: false, message: "You can't access this API" });
    }
    const { name, price, description, category } = req.body;
    if (!name || !price || !description || !category) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const newProduct = new Product({
      name,
      price,
      description,
      category,
    });
    await newProduct.save();
    return res.json({
      success: true,
      message: "Product added successfully",
      newProduct,
    });
  } catch (error) {
    return res.json({ error: error.message });
  }
};
