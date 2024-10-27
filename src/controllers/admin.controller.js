const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { roles } = require("../config/config");

const adminSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(3).max(30).required(),
  profileImageUrl: Joi.string().uri().required(),
});

const createSuperAdmin = async (req, res) => {
  const { error } = adminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, username, profileImageUrl } = req.body;

  try {
    const existingSuperAdmin = await Admin.findOne({ role: roles.superAdmin });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "A super admin already exists." });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with given email." });
    }

    const newSuperAdmin = new Admin({
      email,
      password,
      username,
      profileImageUrl,
      role: roles.superAdmin,
    });

    await newSuperAdmin.save();

    res.status(201).json({ message: "Super admin created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating super admin.", error: error.message });
  }
};

const createAdmin = async (req, res) => {
  const { error } = adminSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, username, profileImageUrl } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with given email." });
    }

    const newAdmin = new Admin({
      email,
      password,
      username,
      profileImageUrl,
    });

    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating admin.", error: error.message });
  }
};

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Invalid email." });
    }

    const isValidPassword = await admin.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: pass, salt, ...rest } = admin.toObject();

    res.status(200).json({ user: rest, token, message: "Login successful." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging in.", error: error.message });
  }
};

module.exports = {
  createSuperAdmin,
  createAdmin,
  loginAdmin,
};
