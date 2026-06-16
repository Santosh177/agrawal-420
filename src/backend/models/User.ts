import mongoose, { Schema, model, models, type Model } from "mongoose";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export const User: Model<UserDocument> =
  (models.User as Model<UserDocument>) ||
  model<UserDocument>("User", userSchema);
