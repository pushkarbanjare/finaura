import jwt from "jsonwebtoken";

// ========== access secret code ==========
const SECRET = process.env.JWT_SECRET!;

// ========== jwt token generation ==========
export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET, {
    expiresIn: "7d",
  });
};

// ========== jwt token verification ==========
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
};
