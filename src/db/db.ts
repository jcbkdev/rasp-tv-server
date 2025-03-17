import Database from "better-sqlite3"
import bcrypt from "bcrypt";
import { User } from "./db.types.js";

export const db = new Database("rasptv.db");

export function addUser(username: string, password: string){
    if(hasUser(username)){
        console.error("User with that name already exists")
    }else{
        bcrypt.hash(password, 10, (err, hash) => {
            if(err){
                console.error("could not hash the password");
            }else{
                const stmt = db.prepare(`INSERT INTO "user" (user_name, user_password) VALUES (?, ?)`)
                stmt.run(username, hash);
            }
        });
    }
}

export function getUser(username: string): User{
    const stmt = db.prepare(`SELECT * FROM "user" WHERE user_name = ?`);
    const user = stmt.get(username) as User;
    return user;
}

export function hasUser(username: string){
    const user = getUser(username);
    return Boolean(user);
}