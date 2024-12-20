import express from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductsById,
  updateProduct,
} from "../../controllers/order/order.js";
import fileParser from "../../middlewares/fileParser.js";

const productRouter = express.Router();

productRouter.route("/").post(fileParser, createProduct).get(getAllProducts);

productRouter
  .route("/:id")
  .get(getProductsById)
  .delete(deleteProductById)
  .put(fileParser, updateProduct);

export default productRouter;
