import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
     res
      .status(401)
      .json({ message: "Access Denied: No token provided" });
      return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded.userId;
    next();
  } catch (err) {
     res.status(403).json({ message: "Invalid token" });
     return;
  }
};
