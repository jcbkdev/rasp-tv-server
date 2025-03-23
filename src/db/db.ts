import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import { User } from "./db.types";
import { getChannelCategory } from "./db.channels";

export const db = new Database("rasptv.db");

export function addUser(username: string, password: string) {
    if (hasUser(username)) {
        console.error("User with that name already exists");
    } else {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("could not hash the password");
            } else {
                const stmt = db.prepare(
                    `INSERT INTO "user" (user_name, user_password) VALUES (?, ?)`
                );
                stmt.run(username, hash);
            }
        });
    }
}

export function getUser(username: string): User {
    const stmt = db.prepare(`SELECT * FROM "user" WHERE user_name = ?`);
    const user = stmt.get(username) as User;
    return user;
}

export function hasUser(username: string) {
    const user = getUser(username);
    return Boolean(user);
}

export function assignChannelToCategory(
    channel_id: number,
    category_id: number
) {
    let stmt = db.prepare(`
        INSERT INTO Relationship_1 (category_id, channel_id) VALUES (?, ?);
    `);

    if (getChannelCategory(channel_id) !== undefined) {
        stmt = db.prepare(`
            UPDATE Relationship_1 SET category_id = ? WHERE channel_id = ?;
        `);
    }

    stmt.run(category_id, channel_id);
    console.log(`Added channel(${channel_id}) to category(${category_id})`);
}
