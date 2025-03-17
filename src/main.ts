import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin";

const app = express();
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("rasptv");
});

app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
    console.log("hi");
});
