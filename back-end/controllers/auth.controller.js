import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
// import generateTokenAndSetCookie from "../utils/generateToken.js";
import jwt from 'jsonwebtoken';
const JWT_SECRET_KEY = "adaudhauhduahduahwdh";
const JWT_EXPIRES = "7d";

import { generateToken } from '../utils/jwtToken.js';

export const signup = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    // Generate JWT token and set as cookie
    return generateToken(savedUser, "User registered successfully", 201, res);

  } catch (error) {
    console.error("Error in signup controller", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const login = () => {};
export const logout = (req, res) => {
  // Determine the cookie name(s) based on the user's role or default
  const cookieNames = ['adminToken', 'retailerToken', 'manufacturerToken', 'sellerToken', 'userToken'];

  // Clear each cookie
  cookieNames.forEach(cookieName => {
    res.clearCookie(cookieName, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Ensure the 'secure' flag is set in production
      sameSite: 'Strict', // This helps prevent CSRF
    });
  });

  // Send a response indicating successful logout
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};





// export const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const user = await User.findOne({ username });
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user?.password || ""
//     );

//     if (!user || !isPasswordCorrect) {
//       return res.status(400).json({ error: "Invalid username or password" });
//     }

//     //     generateTokenAndSetCookie(user._id, res);
//     const token = jwt.sign(
//       {
//         id: user._id,
//         username: user.username,
//         role: user.role,
//       },
//       JWT_SECRET_KEY,
//       {
//         expiresIn: JWT_EXPIRES,
//       }
//     );
 
//     res.status(200).json({
//       _id: user._id,
//       fullName: user.fullname,
//       username: user.username,
//       role: user.role,
//       token:token
//     });
//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateToken(user, "Login successful", 200, res);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const logout = (req, res) => {
//   try {
//     res.cookie("jwt", "", { maxAge: 0 });
//     res.status(200).json({ message: "Logged out successfully" });
//   } catch (error) {
//     console.log("Error in logout controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
