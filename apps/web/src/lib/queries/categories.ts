import { db, eq } from "db";
import {events} from "db/schema";

export const getAllCategoriesKeyValue = async () => {
	const categories = (await db.query.eventCategories.findMany()).reduce(
		(acc, cat) => {
			acc[cat.name] = {
				id: cat.id,
			};
			return acc;
		},
		{} as { [key: string]: { id: string; } },
	);
	return categories;
};

export const getAllCategories = async () => {
	return db.query.eventCategories.findMany();
};
