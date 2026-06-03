import crypto from "crypto";

export function createId(text) {
  return crypto
    .createHash("md5")
    .update(text.toLowerCase())
    .digest("hex");
}