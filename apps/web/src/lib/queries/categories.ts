import { db } from "db";

export const getAllCategoriesKeyValue = async () => {
	const categories = (await db.query.eventCategories.findMany()).reduce(
		(acc, cat) => {
			acc[cat.name] = cat.id;
			return acc;
		},
		{} as { [key: string]: string },
	);
	return categories;
};

export const getAllCategories = async () => {
	return db.query.eventCategories.findMany();
};
