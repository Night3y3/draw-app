import { Router } from "express";
import { middleware } from "../middleware/middleware";
import { CreateRoom } from "../controller/room.controller";
import { SignIn, SignOut, SignUp } from "../controller/auth.controller";

const router: Router = Router();

router.get("/signup", SignUp);

router.get("/login", SignIn);

router.get("/logout", SignOut);

router.get("/create-room", middleware, CreateRoom);

export default router;
