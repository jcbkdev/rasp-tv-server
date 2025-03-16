import "dotenv/config";
import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("rasptv");
});

app.listen(process.env.PORT, () => {
    console.log("hi");
});
