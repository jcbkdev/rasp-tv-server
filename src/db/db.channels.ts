import { assignChannelToCategory, db } from "./db";
import { getCategory } from "./db.categories";
import { Category, Channel } from "./db.types";

export function addChannel(
    channel_name: string,
    channel_url: string,
    channel_logo: string | null = null
) {
    const stmt = db.prepare(`
      INSERT INTO channel (channel_name, channel_url, channel_logo) VALUES (?, ?, ?);
    `);

    stmt.run(channel_name, channel_url, channel_logo);
    console.log(
        `Added channel:\n\tname: ${channel_name}\n\turl: ${channel_url}\n\tlogo: ${channel_logo}`
    );
}

export function editChannel(channel: Channel) {
    const stmt = db.prepare(`
      UPDATE channel
      SET channel_name = ?, 
          channel_url = ?, 
          channel_logo = ?
      WHERE channel_id = ?
  `);

    stmt.run(
        channel.channel_name,
        channel.channel_url,
        channel.channel_logo,
        channel.channel_id
    );

    if (channel.channel_category_id) {
        assignChannelToCategory(
            channel.channel_id,
            channel.channel_category_id
        );
    }

    console.log("Changed channel:", channel);
}

export function getChannel(channel_id: number): Channel | undefined {
    const stmt = db.prepare(`
      SELECT * FROM channel WHERE channel_id = ?
    `);

    const channel = stmt.get(channel_id) as Channel;

    return channel;
}

export function hasChannel(channel_id: number) {
    const channel = getChannel(channel_id);

    return Boolean(channel);
}

export function getAllChannels(): Channel[] {
    const stmt = db.prepare(`
      SELECT c.*, r.category_id AS channel_category_id
      FROM channel c
      LEFT JOIN Relationship_1 r ON c.channel_id = r.channel_id;
  `);

    return stmt.all() as Channel[];
}

export function getChannelCategory(channel_id: number): Category | undefined {
    const getMatchingCategoryId = db.prepare(
        "SELECT * FROM Relationship_1 WHERE channel_id = ?"
    );

    const result = getMatchingCategoryId.get(channel_id) as
        | { category_id: number; channel_id: number }
        | undefined;
    if (result === undefined) return undefined;

    const category = getCategory(result.category_id);
    return category;
}
