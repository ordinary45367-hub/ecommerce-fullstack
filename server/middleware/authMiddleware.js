import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  const token = req.cookies.token;
  if (!token) {
    console.log("No token found in cookies!");
    return res.status(401).json({ success: false, msg: " you have to login" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decode;

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    // Catch explicit token errors gracefully
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ success: false, msg: "Session expired. Please log in again." });
    }

    return res.status(401).json({
      success: false,
      msg: "Authentication failed. Invalid or corrupted token.",
    });
  }
};
export default authenticateUser;
