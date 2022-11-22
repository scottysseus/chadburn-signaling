import express, { Request, Response } from "express";

const app = express();
const port = 8001;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("hello world");
});

app.listen(port, () => {
  console.log(`signaling server started on port ${port}`);
});
