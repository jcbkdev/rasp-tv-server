import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getAllCategories } from "../db/db.categories";

const router = Router();

//LOGIC FOR CLIENT SERVER COMMUNICATION
router.get("/categories", (req, res) => {
    const categories = getAllCategories();
    if (categories === undefined) res.send([]);
    res.send(categories);
});

export default router;
