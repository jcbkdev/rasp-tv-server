import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { setupDatabase } from "../db/db.setup";
import { db, getUser } from "../db/db";
import { userAuth } from "../db/db.auth";
import { Channel } from "../db/db.types";
import { addChannel } from "../db/db.channels";

const router = Router();

const currentDirectory = path.resolve(__dirname);

router.get("/", (req, res) => {
    // check if session is still active
    // if yes then redirect to dashboard
    // if no then redirect to login

    res.sendFile(path.resolve(currentDirectory, "../pages/channels.html"));
});

router.get("/test", (req, res) => {
    console.log(getUser("admin"));
    res.send(getUser("admin"));
});

router.post("/channel", (req, res) => {
    addChannel(String(req.headers.channelname), String(req.headers.channelurl));
    res.send(202);
});

router.post("/db/setup", (req, res) => {
    setupDatabase(db);
    res.status(202).send();
});

export default router;
