import User from "../models/user.model.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = "adaudhauhduahduahwdh";

const roleBasedAuth = (role) => catchAsyncErrors(
  async (req, res, next) => {
    const token = req.cookies[`${role.toLowerCase()}Token`];
    
    if (!token) {
      return next(
        new ErrorHandler(`Dashboard User is not authenticated as ${role}!`, 401)
      );
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      req.user = await User.findById(decoded.id);
      
      if (!req.user || req.user.role !== role) {
        return next(
          new ErrorHandler(`${req.user.role} not authorized for this resource!`, 403)
        );
      }
      
      next();
    } catch (error) {
      return next(
        new ErrorHandler("Invalid token or authentication error!", 403)
      );
    }
  }
);

export const isAdminAuthenticated = roleBasedAuth("Admin");
export const isRetailerAuthenticated = roleBasedAuth("Retailer");
export const isSellerAuthenticated = roleBasedAuth("Seller");
export const isManufacturerAuthenticated = roleBasedAuth("Manufacturer");
