import { razorpayInstance } from "../../configs/razorpay.js";
import crypto from "crypto";
import { asyncHandler } from "../../Utils/errors/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { price } = req.body;
  console.log("price:", req.body);

  const options = {
    amount: price * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully.",
      order,
    });
  } catch (err) {
    console.error("Razorpay Order Creation Error:", err.message || err);

    return res.status(400).json({
      success: false,
      message: err?.message || "Failed to create Razorpay order",
    });
  }
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Razorpay secret key not configured in environment variables.",
    });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (generatedSignature !== razorpaySignature) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature. Payment verification failed.",
    });
  }

  try {
    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      paymentId: razorpayPaymentId,
    });
  } catch (err) {
    console.error("Database Update Error:", err.message || err);

    return res.status(500).json({
      success: false,
      message: "Payment verified, but failed to update the database.",
    });
  }
});
