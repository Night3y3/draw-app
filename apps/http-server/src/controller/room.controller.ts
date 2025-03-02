import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/common/types";
import prisma from "@repo/db/client";

export const CreateRoom = async (
  req: Request,
  res: Response
): Promise<void> => {
  const parsedData = CreateRoomSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({ message: "Incorrect Types" });
    return;
  }

  const userId = req.userId;

  try {
    const room = await prisma.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });

    res.status(200).send({ message: "Room created", ...room });
  } catch (e) {
    res.send(403).send({ message: "Room already exists" });
  }
};
