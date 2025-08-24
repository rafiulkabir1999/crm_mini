import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret" 
console.log(JWT_SECRET,"JWT_SECRET_Generate")
// Generate token
export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET)
}

// Verify token
export function verifyToken(token: string) {
  console.log(token, JWT_SECRET, "verifyToken inside function");
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // sync
    console.log("✅ decoded:", decoded);
    return decoded;
  } catch (err) {
    console.log("❌ JWT verification failed:", err);
    return null;
  }
}


// Decode without verifying (useful for debugging)
export function decodeToken(token: string) {
  return jwt.decode(token,)
}
