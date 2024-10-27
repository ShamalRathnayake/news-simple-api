const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { roles } = require("../config/config");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: roles.admin,
      enum: Object.values(roles),
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Generate a salt and hash the password
    this.salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, this.salt);
  }
  next();
});

adminSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
