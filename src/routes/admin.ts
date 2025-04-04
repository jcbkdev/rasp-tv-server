import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { setupDatabase } from "../db/db.setup";
import { db, getUser } from "../db/db";
import { isAuthenticated, userAuth } from "../db/db.auth";
import { Channel } from "../db/db.types";
import {
    addChannel,
    deleteChannel,
    editChannel,
    getChannel,
} from "../db/db.channels";
import { authMiddleware } from "../middlewares/auth";
import { addCategory } from "../db/db.categories";

const router = Router();

const currentDirectory = path.resolve(__dirname);

router.get("/", (req, res) => {
    // check if session is still active
    // if yes then redirect to dashboard
    // if no then redirect to login
});

router.get("/login", (req, res) => {
    res.sendFile(path.resolve(currentDirectory, "../pages/login.html"));
});

router.post("/login", (req, res) => {
    const username: string = req.headers.username as string;
    const password: string = req.headers.password as string;

    userAuth(username, password)
        .then((auth) => {
            if (!auth) res.send(401);

            res.status(302)
                .cookie("uid", auth!.user_id, { httpOnly: true })
                .cookie("sid", auth!.us, { httpOnly: true })
                .redirect("/admin/channels");
        })
        .catch((err) => {
            console.error("An error occured while logging in", err);
            res.send(500);
        });
});

router.get("/channels", authMiddleware, (req, res) => {
    const cookies = req.cookies;
    if (!cookies || !cookies.sid || !cookies.uid) res.send(401);

    if (!isAuthenticated(cookies.uid, cookies.sid)) res.send(401);

    res.sendFile(path.resolve(currentDirectory, "../pages/channels.html"));
});

router.get("/categories", authMiddleware, (req, res) => {
    res.sendFile(path.resolve(currentDirectory, "../pages/categories.html"));
});

router.get("/test", (req, res) => {
    console.log(getUser("admin"));
    res.send(getUser("admin"));
});

router.post("/channel", authMiddleware, (req, res) => {
    addChannel(
        String(req.body["channel-name"]),
        String(req.body["channel-url"])
    );
    res.send(202);
});

router.put("/channel", authMiddleware, (req, res) => {
    const channel = req.body as Channel;
    editChannel(channel);
    res.send(202);
});

router.delete("/channel/:channel_id", authMiddleware, (req, res) => {
    const { channel_id } = req.params;

    deleteChannel(parseInt(channel_id));

    res.send(202);
});

router.post("/category", authMiddleware, (req, res) => {
    addCategory(String(req.headers.categoryname));
    res.send(202);
});

router.post("/db/setup", (req, res) => {
    setupDatabase(db);
    res.status(202).send();
});

export default router;
