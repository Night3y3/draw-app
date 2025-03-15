import { Router } from "express";
import { middleware } from "../middleware/middleware";
import {
  CreateRoom,
  getPreviousRoomChats,
  getRoomId,
} from "../controller/room.controller";
import { SignIn, SignOut, SignUp } from "../controller/auth.controller";

const router: Router = Router();

router.post("/signup", SignUp);

router.post("/login", SignIn);

router.get("/logout", SignOut);

router.post("/create-room", middleware, CreateRoom);

router.get("/chats/:roomId", middleware, getPreviousRoomChats);

router.get("/room/:slug", getRoomId);

export default router;
