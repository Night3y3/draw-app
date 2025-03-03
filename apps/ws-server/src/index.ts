import WebSocket, { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { verify } from "jsonwebtoken";
import { JWT_SECRET, REDIS_URL } from "@repo/backend-common/config";
import { Queue } from "bullmq";

const wss = new WebSocketServer({ port: 8080 }, () => {
  console.log("WebSocket server running on port 8080");
}).on("error", (error) => {
  console.error("Failed to start WebSocket server:", error);
});

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

// Initialize BullMQ queue for chat messages using Redis Cloud
const chatQueue = new Queue("chat-messages", {
  connection: {
    url: REDIS_URL,
  },
});

function checkToken(token: string): string | null {
  try {
    const decoded = verify(token, JWT_SECRET);
    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      return null;
    }
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

wss.on(
  "connection",
  function connection(ws: WebSocket, request: IncomingMessage) {
    const url = request.url;
    if (!url) {
      ws.close();
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";
    const userId = checkToken(token);

    if (userId === null) {
      ws.close();
      return;
    }

    users.push({
      userId,
      rooms: [],
      ws,
    });

    ws.on("message", function message(data) {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === "join_room") {
        const user = users.find((x) => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (user) {
          user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        }
      }

      if (parsedData.type === "chat") {
        const slug = parsedData.roomId;
        const message = parsedData.message;
        const user = users.find((x) => x.ws === ws);
        if (!user) {
          return;
        }
        const userId = user.userId;

        users.forEach((user) => {
          if (user.rooms.includes(slug)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: message,
                roomId: slug,
                senderId: userId,
              })
            );
          }
        });

        chatQueue.add(
          "save-chat",
          {
            slug,
            message,
            userId,
          },
          {
            attempts: 3,
            backoff: { type: "exponential", delay: 5000 },
            removeOnComplete: true,
            removeOnFail: false,
          }
        );
      }
    });

    ws.on("close", () => {
      const index = users.findIndex((x) => x.ws === ws);
      if (index !== -1) {
        users.splice(index, 1);
      }
    });

    ws.send("Connected to WebSocket server");
  }
);
