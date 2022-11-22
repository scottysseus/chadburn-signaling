import express from "express";
const app = express();
const port = 8001;
app.get("/", (req, res) => {
    res.status(200).send("hello world");
});
app.listen(port, () => {
    console.log(`signaling server started on port ${port}`);
});
