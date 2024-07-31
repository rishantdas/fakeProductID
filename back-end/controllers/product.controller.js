import Product from "../models/product.model.js";

Product;
export const addProduct = async (req, res) => {
  try {
    const { serialNumber, name, brand, desc } = req.body;
    const newProduct = new Product({
      serialNumber,
      name,
      brand,
      desc,
    });
    if (newProduct) {
      const savedproduct = await newProduct.save();
      res.status(201).json(savedproduct);
    } else {
      res.status(400).json({ error: "Invalid Product Data" });
    }
  } catch (error) {
    console.log("Error in addProduct controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
