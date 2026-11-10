import crypto from "node:crypto";

const verificationToken = crypto.randomBytes(32).toString("hex");

console.log(verificationToken);

export const hashedToken = crypto
                           .createHash("sha-256")
                           .update(verificationToken)
                           .digest("hex");


console.log(hashedToken);

const emailVerificationExpires = Date.now() + 15 * 60 * 1000;

console.log(emailVerificationExpires);