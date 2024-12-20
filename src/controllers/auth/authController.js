import User from "../../Models/user/user.js";
import dotenv from "dotenv";
import { sendUserVerificationEmail } from "../../utils/mail/sendmail.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../Utils/errors/asyncHandler.js";
import crypto from "crypto";

dotenv.config();

async function generateReferralId(name, email) {
  const rawString = `${name}${email}`;
  const hashedString = crypto.createHash("sha256").update(rawString).digest("hex"); 
  let referralCode = hashedString.substring(0, 20).toUpperCase(); 


  const existingUser = await User.findOne({ referralId: referralCode });
  if (existingUser) {

    referralCode = await generateReferralId(name, email + Math.random().toString());
  }

  return referralCode;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const referalId = await generateReferralId(name, email);
console.log(referalId,"refid")

  const user = new User({
    name,
    email,
    password,
    referalId,
  });

  await user.save();

  const verificationToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET, 
  );

  console.log("Verification token:", verificationToken);


  const verificationLink = `http://localhost:8000/api/v1/auth/verify/${verificationToken}`;


  await sendUserVerificationEmail(email, "Email Verification", verificationLink);


  res.status(201).json({
    message: "User registered successfully. Please verify your email.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      referalId: user.referalId,
    },
  });
});

export const verify = asyncHandler(async (req, res) => {
  const { token } = req.params;
  console.log("Token:", token);

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findOne({ _id: decoded.userId });


    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified." });
    }


    user.isVerified = true;
    await user.save();


    res.redirect("http://localhost:5173/verification-success");

  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
});



export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  // 2. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // 3. Check if user is verified
  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "Account not verified. Please verify your email." });
  }

  // 4. Verify password
  const isPasswordValid = await user.matchPassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials." });
  }

  // 5. Generate JWT
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET, // Use your JWT secret key
    { expiresIn: "1h" } // Token expiration time
  );
  console.log("token",token)

  // 6. Set JWT as a cookie in the response
  res.cookie("authToken", token, {

    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only sends cookie over HTTPS in production
    sameSite: "lax", // Protect against CSRF attacks
    maxAge: 1 * 60 * 60 * 1000, // 1 hour in milliseconds
  });

  // 7. Respond with success message and user info
  res.status(200).json({
    message: "Login successful",
 
  });
});





export const getUserProfile = asyncHandler(async (req, res) => {
  console.log("Cookies received:", req.cookies);

  const token =
    req.cookies?.authToken || req.header("Authorization")?.replace("Bearer ", "");

  console.log("Extracted Token:", token);

  if (!token) {
    return res.status(401).json({ message: "Authentication token is required!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    const user = await User.findById(decoded.userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({
      message: "User profile fetched successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        referalId:user.referalId,
        isVerified: user.isVerified,
        // Add more profile fields if necessary
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or expired token!" });
  }
});



export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/", // Match the path used when the cookie was set
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});




export const  recharge= asyncHandler(async(req,res)=>{
  const { userId, rechargeAmount } = req.body;


  try {
    // Input validation
    if (!userId || !rechargeAmount) {
      return res.status(400).json({ message: "User ID and recharge amount are required" });
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's recharge data
    user.totalRecharge = (user.totalRecharge || 0) + rechargeAmount;
    user.rechargeBalance = (user.rechargeBalance || 0) + rechargeAmount;
    await user.save();

    // Respond to frontend
    res.status(200).json({
      message: "Recharge successful",
      user: {
        id: user._id,
        totalRecharge: user.totalRecharge,
        rechargeBalance: user.rechargeBalance,
      },
    });
  } catch (error) {
    console.error("Recharge Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});
