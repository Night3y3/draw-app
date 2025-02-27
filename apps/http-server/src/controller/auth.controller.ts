import { Request, Response } from "express";
import { JwtPayload, sign, SignOptions } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const SignUp = async (req: Request, res: Response): Promise<void> => {
  //db logic

  res.status(200).send({ message: "User created" });
};

export const SignIn = async (req: Request, res: Response): Promise<void> => {
  //db logic

  const userId = "1234";

  const token = sign({ userId } as JwtPayload, JWT_SECRET, {
    expiresIn: "1d",
  } as SignOptions);

  res.status(200).send({ message: "User logged in", token });
};

export const SignOut = async (req: Request, res: Response): Promise<void> => {};
