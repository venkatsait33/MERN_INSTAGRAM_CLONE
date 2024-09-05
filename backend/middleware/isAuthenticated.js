import jwt from "jsonwebtoken";


const IsAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    
    if (!token) {
      return res.status(401).json({
        message: "Invalid Token Format",
      });
    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
     if (!decode) {
       return res.status(401).json({
         message: "Invalid",
         success: false,
       });
     }
    req.id = decode.userId;

    console.log(decode.userId);
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Session Expired",
        error: error.message,
      });
    }
    if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
      return res.status(401).json({
        message: "Invalid Token",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Internal server Error",
      error: error.message,
      stack: error.stack,
    });
  }
};

export default IsAuthenticated;
