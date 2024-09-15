import { count, db, eq, gte, sql, inArray, desc } from "db";
import { checkins, events, users, data } from "db/schema";
import c from "config";
import { sEvent } from "./types/events";
import { CheckInUserClientProps } from "db/types";



