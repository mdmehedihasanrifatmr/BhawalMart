import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl:{
      type:String,
      trim:true,
    },
    role: {
      type: String,
      enum: ["admin", "customer","manager"],
      default: "customer",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken:{
      type:String,
      default:null,
    },
    emailVerificationExpires:{
      type:Date,
      default:null,
    }
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("Users", userSchema);
export default User;
