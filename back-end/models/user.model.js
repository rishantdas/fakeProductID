import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  username: {
    type: String,
    required: true,
    unqiue: true,
  },
  email: {
    type: String,
    unqiue: true,
  },
  role: {
    type: String,
    default: 'admin'
  },
  password: {
    type: String,
    required: true,
    min: 3,
  },
});
userSchema.methods.generateJsonWebToken = function () {
  const JWT_SECRET_KEY = "adaudhauhduahduahwdh";
  const JWT_EXPIRES = "7d"; // Hardcoded expiration time

  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      role: this.role 
    },
    JWT_SECRET_KEY,
    {
      expiresIn: JWT_EXPIRES,
    }
  );
};
const User = mongoose.model("User", userSchema);
export default User;
