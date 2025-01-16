import c from "config";

export type Gender = (typeof c.userIdentityOptions.gender)[number];
export type Ethnicity = (typeof c.userIdentityOptions.ethnicity)[number];
