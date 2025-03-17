import { getUser } from "./db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { Database } from "better-sqlite3";
import { db } from "./db";
import { AuthDetails, UserSession } from "./db.types";

function generateSessionId(length: number): string {
    const sessionId = crypto.randomBytes(length / 2).toString("hex");
    return sessionId;
}

function getSession(userId: number) {
    const stmt = db.prepare(`
        SELECT * FROM user_session WHERE user_id = ?    
    `);

    const session = stmt.get(userId) as UserSession;

    return session;
}

function hasSession(userId: number) {
    const session = getSession(userId);
    return Boolean(session);
}

function deleteSession(userId: number) {
    const deleteSessionStmt = db.prepare(`
        DELETE FROM user_session WHERE user_id = ?    
    `);
    const setNullSessionStmt = db.prepare(`
        UPDATE "user" SET us_id = NULL WHERE user_id = ?    
    `);

    setNullSessionStmt.run(userId);
    deleteSessionStmt.run(userId);
}

function createSession(userId: number) {
    const insertSession = db.prepare(`
        INSERT INTO user_session (user_id, us) VALUES (?, ?) RETURNING us_id
    `);

    const updateUserSession = db.prepare(`
        UPDATE "user" SET us_id = ? WHERE user_id = ?
    `);

    const sessionId = generateSessionId(64);

    if (hasSession(userId)) {
        deleteSession(userId);
    }

    const session = insertSession.get(userId, sessionId) as UserSession;
    if (!session) {
        throw new Error("Failed to create session.");
    }

    updateUserSession.run(session.us_id, userId);

    return sessionId;
}

export async function userAuth(
    username: string,
    password: string
): Promise<AuthDetails | null> {
    const user = getUser(username);
    const result = await bcrypt
        .compare(password, user.user_password)
        .catch((err) => {
            console.error("An error occured while comparing passwords", err);
            throw new Error(err);
        });

    if (result) {
        console.log(
            `Successful login\n\tuser: ${user.user_name}\n\tuser_id: ${user.user_id}`
        );
        const us = createSession(user.user_id);
        const authDetails: AuthDetails = {
            user_id: user.user_id,
            user_name: user.user_name,
            us: us,
        };

        return authDetails;
    }
    return null;
}

export function isAuthenticated(user_id: number, sessionId: string): boolean {
    const dbUserSession = getSession(user_id);
    return dbUserSession.us === sessionId;
}

// export function isAuthenticatedByCookies(cookies): boolean {}
