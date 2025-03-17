import { Router } from "express";
import path from "path"
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../pages/channels.html"));
});

export default router;
