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

export const getPreviousRoomChats = async (
  req: Request,
  res: Response
): Promise<void> => {
  const roomId = Number(req.params.roomId);
  const messages = await prisma.chat.findMany({
    where: {
      roomId: roomId,
    },
    orderBy: {
      id: "desc",
    },
    take: 4,
  });

  res.status(200).send({ ...messages });
};

export const getRoomId = async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;
  const room = await prisma.room.findFirst({
    where: {
      slug,
    },
  });

  res.status(200).send({ ...room });
};
