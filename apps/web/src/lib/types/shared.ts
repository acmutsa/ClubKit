import c, { majors } from "config";
export type SearchParams = { [key: string]: string | undefined };
export type IDParamProp = { params: { id: string } };
export type ExportNames =
	| "events"
	| "checkins"
	| "members"
	| "semesters"
	| "categories";

export type MajorType = (typeof majors)[number];
export type ClassificationType =
	(typeof c.userIdentityOptions.classification)[number];
export type GenderType = (typeof c.userIdentityOptions.gender)[number];
export type EthnicityType = (typeof c.userIdentityOptions.ethnicity)[number];
export type MemberType = (typeof c.memberRoles)[number];
export type ShirtSizeType = (typeof c.userIdentityOptions.shirtSize)[number];
export type ShirtType = (typeof c.userIdentityOptions.shirtType)[number];
