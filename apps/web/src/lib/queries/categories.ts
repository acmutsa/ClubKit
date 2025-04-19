import { db } from "db";

export const getAllCategoriesKeyValue = async () => {
	const categories = (await db.query.eventCategories.findMany()).reduce(
		(acc, cat) => {
			acc[cat.name] ={
				id:cat.id,
				thumbnailUrl: cat.thumbnailUrl,
			};
			return acc;
		},
		{} as { [key: string]: { id: string; thumbnailUrl: string } },
	);
	return categories;
};

export const getAllCategories = async () => {
	return db.query.eventCategories.findMany();
};
