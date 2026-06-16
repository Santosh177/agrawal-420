"use client";

interface SignatureData {
  signature: string;
  timestamp: number;
  folder: string;
  cloudName: string;
  apiKey: string;
}

/**
 * Uploads a product image directly to Cloudinary from the browser.
 * 1. Fetches a signed upload token from our server-side API route.
 * 2. POSTs the file to Cloudinary using that signature.
 * Returns the secure Cloudinary URL.
 */
export async function uploadProductImage(file: File): Promise<string> {
  // Step 1: get signed params from our API so the secret never touches the client.
  const sigRes = await fetch("/api/upload/signature");
  if (!sigRes.ok) {
    throw new Error("Could not get upload signature. Are Cloudinary env vars set?");
  }
  const { data }: { data: SignatureData } = await sigRes.json();

  // Step 2: upload directly to Cloudinary.
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", data.apiKey);
  formData.append("timestamp", String(data.timestamp));
  formData.append("signature", data.signature);
  formData.append("folder", data.folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) {
    const err: { error?: { message?: string } } = await uploadRes.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? "Cloudinary upload failed");
  }

  const result: { secure_url: string } = await uploadRes.json();
  return result.secure_url;
}
