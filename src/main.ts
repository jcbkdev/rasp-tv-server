import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin";
import apiRoutes from "./routes/api";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("rasptv");
});

app.use("/admin", adminRoutes);

app.use("/api", apiRoutes);

app.listen(process.env.PORT, () => {
    console.log("hi");
});
