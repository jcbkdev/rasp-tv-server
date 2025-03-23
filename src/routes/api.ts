import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getAllCategories } from "../db/db.categories";
import { getAllChannels } from "../db/db.channels";

const router = Router();

//LOGIC FOR CLIENT SERVER COMMUNICATION
router.get("/categories", (req, res) => {
    const categories = getAllCategories();
    if (categories === undefined) res.send([]);
    res.send(categories);
});

router.get("/channels", (req, res) => {
    const channels = getAllChannels();
    if (channels === undefined) res.send([]);
    res.send(channels);
});

export default router;
