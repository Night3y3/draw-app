import { Request, Response } from "express";
import { JwtPayload, sign, SignOptions } from "jsonwebtoken";
const { JWT_SECRET } = require("@repo/backend-common/config");
const { CreateUserSchema, SignInSchema } = require("@repo/common/types");
const prismaClient = require("@repo/db/client");

export const SignUp = async (req: Request, res: Response): Promise<void> => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ message: "Incorrect Types" });
    return;
  }

  try {
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username,
        name: parsedData.data.name,
        password: parsedData.data.password,
      },
    });
    res.status(200).send({ message: "User created", ...user });
  } catch (e) {
    res.status(401).send({ message: "error creating user" });
  }
};

export const SignIn = async (req: Request, res: Response): Promise<void> => {
  const data = SignInSchema.safeParse(req.body);

  if (!data.success) {
    res.json({ message: "Incorrect Types" });
    return;
  }

  const userId = "1234";

  const token = sign({ userId } as JwtPayload, JWT_SECRET, {
    expiresIn: "1d",
  } as SignOptions);

  res.status(200).send({ message: "User logged in", token });
};

export const SignOut = async (req: Request, res: Response): Promise<void> => {};
