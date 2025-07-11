import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      required: true,
      default: function () {
        return `https://picsum.photos/200?random=${Math.floor(
          Math.random() * 1000
        )}`;
      },
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    city: {
      type: String,
    },
    pincode: {
      type: String,
    },
    address: {
      type: String,
    },
    signUpOtp: String,
    signUpOtpExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    console.log("error in hashing password", error);
    return next(error);
  }
});

UserSchema.methods.generateJwtToken = function () {
  const token = jwt.sign(
    { _id: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "30d" }
  );
  return token;
};

export const User = mongoose.model("User", UserSchema);
