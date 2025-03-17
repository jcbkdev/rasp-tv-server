import { db } from "./db";
import { Category } from "./db.types";

export function addCategory(category_name: string) {
    const stmt = db.prepare(`
    INSERT INTO category (category_name) VALUES (?);
  `);

    stmt.run(category_name);
    console.log(`Added category:\n\tname: ${category_name}`);
}

export function getCategory(category_id: number): Category | undefined {
    const stmt = db.prepare(`
      SELECT * FROM category WHERE category_id = ?
    `);

    const category = stmt.get(category_id) as Category;

    return category;
}

export function hasCategory(category_id: number) {
    const channel = getCategory(category_id);

    return Boolean(channel);
}

export function getAllCategories(): Category[] | undefined {
    const stmt = db.prepare(`
    SELECT * FROM category;
  `);

    let categories = stmt.all() as Category[];

    return categories;
}
