import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret" 

// Generate token
export function generateToken(payload: object, expiresIn: string | number = "1h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

// Verify token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
  } catch (err) {
    return null
  }
}

// Decode without verifying (useful for debugging)
export function decodeToken(token: string) {
  return jwt.decode(token)
}
