import "dotenv/config";
import express from "express";
import adminRoutes from "./routes/admin.js"

const app = express();

app.get("/", (req, res) => {
    res.send("rasptv");
});

app.use("/admin", adminRoutes)

app.listen(process.env.PORT, () => {
    console.log("hi");
});
