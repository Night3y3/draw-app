import express, { NextFunction, Request, Response } from "express";
import router from "./routes/route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // If withCredentials is true on frontend
  })
);
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Woking" });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
