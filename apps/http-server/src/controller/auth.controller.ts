import { Request, Response } from "express";
import { JwtPayload, sign, SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SignInSchema } from "@repo/common/types";
import prisma from "@repo/db/client";

export const SignUp = async (req: Request, res: Response): Promise<void> => {
  const parsedData = CreateUserSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ message: "Incorrect Types" });
    return;
  }

  try {
    const user = await prisma.user.create({
      data: {
        email: parsedData.data.username,
        name: parsedData.data.name,
        password: parsedData.data.password,
      },
    });
    res.status(200).send({ message: "User created", ...user });
  } catch (e) {
    res
      .status(401)
      .send({ message: "error creating user... might already exists" });
  }
};

export const SignIn = async (req: Request, res: Response): Promise<void> => {
  const parsedData = SignInSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ message: "Incorrect Types" });
    return;
  }

  const user = await prisma.user.findFirst({
    where: {
      email: parsedData.data.username,
      password: parsedData.data.password,
    },
  });

  if (!user) {
    res.status(404).json({ message: "user not found" });
  }

  const userId = user?.id;

  const token = sign({ userId } as JwtPayload, JWT_SECRET, {
    expiresIn: "1d",
  } as SignOptions);

  res.status(200).send({ message: "User logged in", token, ...user });
};

export const SignOut = async (req: Request, res: Response): Promise<void> => {};
