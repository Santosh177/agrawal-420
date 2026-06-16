import { connectDB } from "@/shared/lib/db";
import { User, type UserDocument } from "@/backend/models/User";

export const userRepository = {
  async findByEmail(email: string): Promise<UserDocument | null> {
    await connectDB();
    return User.findOne({ email: email.toLowerCase() }).lean<UserDocument>();
  },

  async findById(id: string): Promise<UserDocument | null> {
    await connectDB();
    return User.findById(id).lean<UserDocument>();
  },

  async create(data: Partial<UserDocument>): Promise<UserDocument> {
    await connectDB();
    const doc = await User.create(data);
    return doc.toObject();
  },

  async upsertByEmail(
    email: string,
    data: Partial<UserDocument>
  ): Promise<UserDocument | null> {
    await connectDB();
    return User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: data },
      { new: true, upsert: true }
    ).lean<UserDocument>();
  },
};
