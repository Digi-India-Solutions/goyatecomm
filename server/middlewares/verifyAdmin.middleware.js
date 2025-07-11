import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized you are not logged In" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(decoded.role !== "admin") {
      return res.status(403).json({ message: "Access Denied — This feature is restricted to administrators only." });
    }
    next();
  } catch (error) {
    console.log("Verify token error", error);
    return res.status(500).json({ message: "Unauthorized Invalid token" });
  }
};
