import { userRepository } from "@/backend/repositories/user.repository";
import { verifyPassword, signToken } from "@/shared/lib/auth";
import { loginSchema, type LoginInput } from "@/shared/lib/validators";
import { HttpError } from "@/shared/lib/api-response";
import type { AdminUserDTO } from "@/admin/types";

export const authService = {
  /** Validates credentials and returns a signed JWT + safe user DTO. */
  async login(input: LoginInput): Promise<{ token: string; user: AdminUserDTO }> {
    const { email, password } = loginSchema.parse(input);

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new HttpError("Invalid email or password", 401);
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new HttpError("Invalid email or password", 401);
    }

    const token = await signToken({
      sub: String(user._id),
      email: user.email,
      role: "admin",
    });

    return {
      token,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: "admin",
      },
    };
  },

  async getCurrentUser(userId: string): Promise<AdminUserDTO> {
    const user = await userRepository.findById(userId);
    if (!user) throw new HttpError("User not found", 404);
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: "admin",
    };
  },
};
