import jwt from "jsonwebtoken";
import User from "../Models/user/user.js"; // Ensure correct path to the User model
import { asyncHandler } from "../Utils/errors/asyncHandler.js";



// Middleware to authenticate token
export const authenticateToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.authToken; // Get token from cookies
  console.log("Token from cookies:", token);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token is missing" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);

    // Find the user by ID and exclude sensitive fields
    const user = await User.findById(decoded.userId).select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({ message: "User associated with the token not found!" });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token!" });
  }
});

// Middleware to verify user permissions based on roles
export const verifyPermission = (roles = []) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User is missing!" });
    }

    // Check if user role matches allowed roles
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions!" });
    }

    next();
  });
  
