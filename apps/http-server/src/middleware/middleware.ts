import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
const { JWT_SECRET } = require("@repo/backend-common/config");

export function middleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> | void {
  const token = req.headers["authorization"] as string | undefined;

  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  const decoded = verify(token, JWT_SECRET) as { userId: string };

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).send("Unauthorized");
    return;
  }
}
