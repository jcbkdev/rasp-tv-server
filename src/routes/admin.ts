import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { setupDatabase } from "../db/db.setup";
import { db, getUser } from "../db/db";
import { userAuth } from "../db/db.auth";

const router = Router();

const currentDirectory = path.resolve(__dirname);

router.get("/", (req, res) => {
    // check if session is still active
    // if yes then redirect to dashboard
    // if no then redirect to login

    res.sendFile(path.resolve(currentDirectory, "../pages/channels.html"));
});

router.get("/test", (req, res) => {
    userAuth("admin", "admin").then(console.log);
    res.send(getUser("admin"));
});

router.post("/db/setup", (req, res) => {
    setupDatabase(db);
    res.status(202).send();
});

export default router;
