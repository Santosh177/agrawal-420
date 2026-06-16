/**
 * Centralized, validated access to environment variables.
 * Server-only values are read lazily so that client bundles don't require them.
 */

function required(name: string, value: string | undefined): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  get mongodbUri(): string {
    return required("MONGODB_URI", process.env.MONGODB_URI);
  },
  get jwtSecret(): string {
    return required("JWT_SECRET", process.env.JWT_SECRET);
  },
  get adminEmail(): string {
    return required("ADMIN_EMAIL", process.env.ADMIN_EMAIL);
  },
  get adminPassword(): string {
    return required("ADMIN_PASSWORD", process.env.ADMIN_PASSWORD);
  },
  get cloudinaryFolder(): string {
    return process.env.CLOUDINARY_UPLOAD_FOLDER ?? "namkeen420/products";
  },
};

/** Public env values are safe to read on the client (must be NEXT_PUBLIC_*). */
export const publicEnv = {
  whatsappNumber: process.env.NEXT_PUBLIC_BUSINESS_WHATSAPP_NUMBER ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
};
