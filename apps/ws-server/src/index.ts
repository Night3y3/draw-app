import WebSocket, { WebSocketServer } from "ws";
import { IncomingMessage } from "http";
import { verify } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on(
  "connection",
  function connection(ws: WebSocket, request: IncomingMessage) {
    const url = request.url;
    if (!url) {
      return;
    }

    const queryParams = new URLSearchParams(url.split("?")[1]);
    const token = queryParams.get("token") ?? "";

    const decoded = verify(token, JWT_SECRET);

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      ws.close();
      return;
    }

    ws.on("message", function message(data) {
      console.log("received: %s", data);
    });

    ws.send("something");
  }
);
