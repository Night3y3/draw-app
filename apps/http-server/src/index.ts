import express, { Request, Response } from "express";
import router from "./routes/route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(router);
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "Woking" });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
