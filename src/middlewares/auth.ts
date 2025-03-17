import { isAuthenticated } from "../db/db.auth";
import { Request, Response, NextFunction } from "express";

export async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { uid, sid } = req.cookies;
        if (!uid || !sid) {
            res.status(401).send("Unauthorized: No credentials provided");
            return; // Ensure the function doesn't proceed
        }

        const auth = await isAuthenticated(uid, sid);
        if (!auth) {
            res.status(401).send("Unauthorized: Invalid session");
            return;
        }

        next(); // Move to the next middleware/route handler
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).send("Internal Server Error");
    }
}
