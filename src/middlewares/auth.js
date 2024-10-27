const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const auth = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const admin = await Admin.findById(decoded.id);
      if (!admin) return res.status(404).json({ error: "Admin not found" });

      req.user = admin;

      if (roles.length && !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden. Insufficient permissions." });
      }

      next();
    } catch (error) {
      return res.status(400).json({ message: "Invalid token." });
    }
  };
};

module.exports = auth;
