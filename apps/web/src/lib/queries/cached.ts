/**
 * This file contains cached versions of database queries.
 * These functions should ONLY be called from React Server Components
 * (i.e. pages, components, layouts etc.)
 *
 * Note: The cache only persists within a single request's component tree.
 * It does not persist between different requests.
 */

import { cache } from "react";
import { getRichUserData } from "./users";

export const getCachedRichUserData = cache(async (clerkID: string) => {
	const data = await getRichUserData(clerkID);
	return data;
});
