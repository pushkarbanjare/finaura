import { verifyToken } from "./jwt";

export const getUserIdFromRequest = (req: Request) => {
  const authorization = req.headers.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return null;

  const token = authorization.split(" ")[1];
  const decoded = verifyToken(token);
  return decoded?.userId || null;
};
