import bcrypt from "bcryptjs";
import Profile from "../models/profile.model.js";
// import generateTokenAndSetCookie from "../utils/generateToken.js";

export const createAccount = async (req, res) => {
    try {
      // Extract admin's username from the JWT token
   
  
      const { username, name, location, desc, website, role, imageurl } = req.body;
  
      // Create a new Profile instance with admin's username
      const user = new Profile({
        username,
        name,
        desc,
        website,
        location,
        role,
        imageurl
        
      });
  
      // Save the new profile
      const savedUser = await user.save();
      res.status(200).json(savedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
export const getAccount = async (req, res) => {
    try {
        const { username } = req.params;

        const response = await Profile.findOne({ username: username });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

