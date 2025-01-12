export type SearchParams = { [key: string]: string | undefined };
export type IDParamProp = { params: { id: string } };
export type ExportNames =
	| "events"
	| "checkins"
	| "members"
	| "semesters"
	| "categories";
