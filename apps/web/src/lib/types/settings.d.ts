import c from "config";

type Gender = (typeof c.userIdentityOptions.gender)[number];
type Ethnicity = (typeof c.userIdentityOptions.ethnicity)[number];
