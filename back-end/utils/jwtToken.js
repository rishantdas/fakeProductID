export const generateToken = (user, message, statusCode, res) => {
    const token = user.generateJsonWebToken();
    
    // Determine the cookie name based on the user's role
    let cookieName;
    switch (user.role) {
      case 'Admin':
        cookieName = 'adminToken';
        break;
      case 'Retailer':
        cookieName = 'retailerToken';
        break;
      case 'Manufacturer':
        cookieName = 'manufacturerToken';
        break;
      case 'Seller':
        cookieName = 'sellerToken';
        break;
      default:
        cookieName = 'userToken'; // Default token name for other roles
    }
  
    // Hardcoded cookie expiration time (e.g., 7 days)
    const COOKIE_EXPIRE_DAYS = 7;
  
    res
      .status(statusCode)
      .cookie(cookieName, token, {
        expires: new Date(
          Date.now() + COOKIE_EXPIRE_DAYS * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      })
      .json({
        success: true,
        message,
        user,
        token,
      });
  };
  export default generateToken;
  