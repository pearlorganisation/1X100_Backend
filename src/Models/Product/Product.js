
import mongoose from "mongoose";


// Define the recharge schema
const rechargeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  image: {
    secure_url: { type: String },
    public_id: { type: String },
    asset_id: { type: String },
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
  },
  daily: {
    type: Number,
    required: [true, "Daily rent price is required"],
  },
  term: {
    type: Number,
    required: [true, "Rental term is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  razorpay_order_id: {
    type: String,
  },
  razorpay_payment_id: {
    type: String,
  },
 
});

// Export the RechargePlan model
const RechargePlan = mongoose.model("RechargePlan", rechargeSchema);

// Function to generate a referral ID


export default RechargePlan;
