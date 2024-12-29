import z from "zod";
import {selectCheckinSchema, userCheckinSchemaFormified, insertUserWithDataSchemaFormified} from "./zod";

export type Checkin = z.infer<typeof selectCheckinSchema>;
export type CheckInUserClientProps = z.infer<typeof userCheckinSchemaFormified>;
export type UserWithDataSchemaType = z.infer<typeof insertUserWithDataSchemaFormified>;