import { Worker, Job } from "bullmq";
import prisma from "@repo/db/client";
import { REDIS_URL } from "@repo/backend-common/config";

// In-memory cache for slug to roomId mappings
const roomIdCache: { [slug: string]: number } = {};

const worker = new Worker(
  "chat-messages",
  async (job) => {
    const { slug, message, userId } = job.data;

    try {
      // Check cache first
      let roomId = roomIdCache[slug];
      if (!roomId) {
        // Query room ID from slug if not cached
        const room = await prisma.room.findUnique({
          where: { slug },
          select: { id: true },
        });
        if (!room) {
          throw new Error("Room not found");
        }
        roomId = room.id;
        roomIdCache[slug] = roomId; // Cache the result
      }

      // Save to Chat table
      await prisma.chat.create({
        data: {
          roomId,
          message,
          userId,
        },
      });
    } catch (error) {
      console.error("Failed to save chat message:", error);
      throw error; // Trigger BullMQ retry mechanism
    }
  },
  {
    connection: {
      url: REDIS_URL, // Full Redis URL from Redis Cloud
    },
  }
);

worker.on("completed", (job: Job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job: Job | undefined, err) => {
  if (job) {
    console.error(`Job ${job.id} failed:`, err);
  } else {
    console.error(`Job failed:`, err);
  }
});
