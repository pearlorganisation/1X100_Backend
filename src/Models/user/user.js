import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String, 
      required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  totalRecharge: {
    type: Number,
    default: 0, // Default to 0 if no recharge data is provided
  },
  totalWithdraw: {
    type: Number,
    default: 0, // Default to 0 if no withdraw data is provided
  },
  rechargeBalance: {
    type: Number,
    default: 0, // Default to 0 if no balance data is provided
  },
  referalId: {
    type: String,
    unique: true,
  },
  refferedBy: {
    type: String,
    default: null,
  },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check if entered password matches the hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
