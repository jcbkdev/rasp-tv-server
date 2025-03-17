import fs from "fs"
import { Database } from "better-sqlite3";
import { addUser } from "./db.js";
import path from "path";

export function setupDatabase(db: Database): void {
    try{
        createDatabase(db);
        createAdminAccount()
    }catch(err){
        console.error("An error occured while setting up a database", err)
    }
}

function createDatabase(db: Database): void {
    const sql = `
    create table category (
    category_id          INTEGER                        not null,
    category_name        VARCHAR(50)                    not null,
    primary key (category_id)
    );

    create table channel (
    channel_id           INTEGER                        not null,
    channel_name         VARCHAR(50)                    not null,
    channel_url          VARCHAR(512)                   not null,
    channel_logo         VARCHAR(256),
    primary key (channel_id)
    );

    create table Relationship_1 (
    category_id          INTEGER                        not null,
    channel_id           INTEGER                        not null,
    primary key (category_id, channel_id),
    foreign key (category_id)
        references category (category_id),
    foreign key (channel_id)
        references channel (channel_id)
    );

    create unique index Relationship_1_PK on Relationship_1 (
    category_id ASC,
    channel_id ASC
    );

    create  index Relationship_1_FK on Relationship_1 (
    category_id ASC
    );

    create  index Relationship_2_FK on Relationship_1 (
    channel_id ASC
    );

    create table channel_list (
    list_id              INTEGER                        not null,
    list_name            CHAR(128)                      not null,
    primary key (list_id)
    );

    create table Relationship_2 (
    list_id              INTEGER                        not null,
    channel_id           INTEGER                        not null,
    primary key (list_id, channel_id),
    foreign key (list_id)
        references channel_list (list_id),
    foreign key (channel_id)
        references channel (channel_id)
    );

    create unique index Relationship_2_PK on Relationship_2 (
    list_id ASC,
    channel_id ASC
    );

    create  index Relationship_3_FK on Relationship_2 (
    list_id ASC
    );

    create  index Relationship_4_FK on Relationship_2 (
    channel_id ASC
    );

    create unique index category_PK on category (
    category_id ASC
    );

    create unique index channel_PK on channel (
    channel_id ASC
    );

    create unique index channel_list_PK on channel_list (
    list_id ASC
    );

    create table profile_session (
    ps_id                INTEGER                        not null,
    profile_id           INTEGER                        not null,
    ps                   VARCHAR(512)                   not null,
    primary key (ps_id),
    foreign key (profile_id)
        references profile (profile_id)
    );

    create table profile (
    profile_id           INTEGER                        not null,
    list_id              INTEGER,
    ps_id                INTEGER,
    profile_name         VARCHAR(50)                    not null,
    profile_pin          NUMERIC(4)                     not null,
    profile_image        VARCHAR(256),
    primary key (profile_id),
    foreign key (ps_id)
        references profile_session (ps_id),
    foreign key (list_id)
        references channel_list (list_id)
    );

    create unique index profile_PK on profile (
    profile_id ASC
    );

    create  index Relationship_6_FK on profile (
    ps_id ASC
    );

    create  index Relationship_9_FK on profile (
    list_id ASC
    );

    create unique index profile_session_PK on profile_session (
    ps_id ASC
    );

    create  index Relationship_5_FK on profile_session (
    profile_id ASC
    );

    create table user_session (
    us_id                INTEGER                        not null,
    user_id              INTEGER                        not null,
    us                   VARCHAR(512)                   not null,
    primary key (us_id),
    foreign key (user_id)
        references "user" (user_id)
    );

    create table "user" (
    user_id              INTEGER                        not null,
    us_id                INTEGER,
    user_name            VARCHAR(50)                    not null,
    user_password        VARCHAR(256)                   not null,
    primary key (user_id),
    foreign key (us_id)
        references user_session (us_id)
    );

    create unique index user_PK on "user" (
    user_id ASC
    );

    create  index Relationship_8_FK on "user" (
    us_id ASC
    );

    create unique index user_session_PK on user_session (
    us_id ASC
    );

    create  index Relationship_7_FK on user_session (
    user_id ASC
    );
    `;
    
    // Execute each statement individually for better error handling
    const statements = sql.split(";").map(stmt => stmt.trim()).filter(stmt => stmt.length > 0);

    db.exec("BEGIN TRANSACTION;");
    try {
        statements.forEach(stmt => {
            console.log("Executing:", stmt);
            try {
                db.prepare(stmt).run();
            } catch (statementErr: any) {
                // If it's just a warning about the table already existing, log and continue
                if (statementErr.code === 'SQLITE_ERROR' && 
                    statementErr.message.includes('already exists')) {
                    console.log(`Warning: ${statementErr.message}. Continuing.`);
                } else {
                    throw statementErr; // Re-throw other errors
                }
            }
        });
        db.exec("COMMIT;");
        console.log("Database setup completed successfully.");
    } catch (err) {
        db.exec("ROLLBACK;");
        console.error("Database setup failed:", err);
        throw err; // Re-throw to signal failure
    }
}

function createAdminAccount(): void {
    addUser("admin", "admin");
}