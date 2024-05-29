import { db } from "db";

export const getCategoryOptions = async () => {
	const categories = await db.query.eventCategories.findMany();
	return categories;
};
