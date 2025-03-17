import { Channel } from "diagnostics_channel";
import { db } from "./db";

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
