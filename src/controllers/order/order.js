import { isValidObjectId } from "mongoose";
import RechargePlan from "../../Models/Product/Product.js";
import { asyncHandler } from "../../Utils/errors/asyncHandler.js";
import {
  deleteFileFromCloudinary,
  uploadFileToCloudinary,
} from "../../configs/cloudinary.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await RechargePlan.find();

    if (products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Products found" });
    }

    res.status(200).json({
      success: true,
      message: "Prodcuts fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
  }
});

export const getProductsById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidID = isValidObjectId(id);

    if (!isValidID)
      return res.json({
        success: false,
        message: " Not a Valid Mongo DB Object ID",
      });

    const product = await RechargePlan.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product with ID fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const { image } = req.files;
  let uploadedImage = [];
  if (image) {
    uploadedImage = await uploadFileToCloudinary(image);
  }

  try {
    const newProduct = await RechargePlan.create({
      ...req?.body,
      image: uploadedImage[0],
    });

    return res.json({
      success: true,
      message: "Product Added Successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log(error, "my  error");
  }
});

export const deleteProductById = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;

    const isValidID = isValidObjectId(id);

    if (!isValidID)
      return res.json({
        success: false,
        message: " Not a Valid Mongo DB Object ID",
      });

    const product = await RechargePlan.findByIdAndDelete(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product with ID deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { image } = req.files;

  const isValidID = isValidObjectId(id);

  if (!isValidID)
    return res.json({
      success: false,
      message: " Not a Valid Mongo DB Object ID",
    });

  try {
    const existingProduct = await RechargePlan.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let uploadedImage = existingProduct.image;

    if (image) {
      if (existingProduct.image?.public_id) {
        await deleteFileFromCloudinary(existingProduct.image);
      }

      const uploadedImages = await uploadFileToCloudinary(image);
      uploadedImage = uploadedImages[0];
    }

    const updatedProduct = await RechargePlan.findByIdAndUpdate(
      id,
      {
        ...req.body,
        image: uploadedImage,
      },
      { new: true }
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
