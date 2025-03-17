import { Router } from "express";
import path from "path"
import { fileURLToPath } from "url";
import { setupDatabase } from "../db/db.setup.js";
import { db, getUser } from "../db/db.js";
import { userAuth } from "../db/db.auth.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
    // check if session is still active
    // if yes then redirect to dashboard
    // if no then redirect to login

    res.sendFile(path.resolve(__dirname, "../pages/channels.html"));
});

router.get("/test", (req,res) => {
    userAuth("admin", "admin").then(console.log)
    res.send(getUser("admin"))
})

router.post("/db/setup", (req, res) => {
    setupDatabase(db);
    res.status(202).send();
})

export default router;
