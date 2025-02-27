import { Request, Response } from "express";

export const CreateRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  //db logic

  res.status(200).send({ message: "Room created", roomId: "1234" });
};
