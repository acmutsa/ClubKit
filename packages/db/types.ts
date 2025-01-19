import z from "zod";
import {
	selectCheckinSchema,
	userCheckinSchemaFormified,
	insertUserWithDataSchemaFormified,
	selectUserWithDataSchema
} from "./zod";

export type Checkin = z.infer<typeof selectCheckinSchema>;
export type CheckInUserClientProps = z.infer<typeof userCheckinSchemaFormified>;
export type UserWithData = z.infer<typeof selectUserWithDataSchema>;

