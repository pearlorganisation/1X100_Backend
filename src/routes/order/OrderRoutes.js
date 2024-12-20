import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../../controllers/order/orderControllers.js";

const rechargerouter = express.Router();

rechargerouter.route("/create").post(createOrder);
rechargerouter.route("/verify").post(verifyPayment);

export default rechargerouter;
