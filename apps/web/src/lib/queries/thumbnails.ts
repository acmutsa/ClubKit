import { db } from "db";

export async function getAllThumbnails() {
  return db.query.thumbnails.findMany();
}