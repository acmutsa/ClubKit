import { auth } from "@clerk/nextjs/server";
import { db } from "db";
import { users, data, checkins, events } from "db/schema";
import { eq, count, between, sum, sql } from "db/drizzle";
import { redirect } from "next/navigation";
import c from "config";
import { RadialChartProgress } from "@/components/shared/circular-progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VERCEL_IP_TIMEZONE_HEADER_KEY } from "@/lib/constants";
import { getClientTimeZone } from "@/lib/utils";
import { headers } from "next/headers";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, GraduationCapIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { formatInTimeZone } from "date-fns-tz";

interface AttendedEvents {
	id: string;
	name: string;
	points: number;
	start: typeof events.start;
}

export default async function UserDash({
	userId,
	clientTimeZone,
}: {
	userId: string;
	clientTimeZone: string;
}) {
	// Cache this later
	const queryResult = await db
		.select({
			user: users,
			userData: data,
			attendedEvents: sql<
				Array<AttendedEvents>
			>`JSONB_AGG(JSONB_BUILD_OBJECT(
			'id', ${events.id},
			'name', ${events.name},
			'points', ${events.points},
			'start', ${events.start}) ORDER BY ${events.start} DESC)`.as("attendedEvents"),
			// Still do not think the dates are working right here
			currentSemesterPoints:
				sql`SUM(${events.points}) FILTER (WHERE ${checkins.time} BETWEEN ${c.semesters.current.startDate} AND ${c.semesters.current.endDate})`.mapWith(
					Number,
				),
			totalPoints: sum(events.points),
			currentSemesterEventsAttended: count(
				between(
					checkins.time,
					c.semesters.current.startDate,
					c.semesters.current.endDate,
				),
			),
			totalEventsAttended: count(checkins.userID),
			userCheckins: sql`ARRAY_AGG(${checkins.eventID})`,
		})
		.from(users)
		.innerJoin(data, eq(users.userID, data.userID))
		.leftJoin(checkins, eq(users.userID, checkins.userID))
		.leftJoin(events, eq(events.id, checkins.eventID))
		.groupBy(users.userID, data.userID)
		.where(eq(users.clerkID, userId));

	if (queryResult.length === 0) {
		return redirect("/sign-in");
	}

	const userDashResult = queryResult[0];

	const {
		user,
		userData,
		currentSemesterPoints,
		totalPoints,
		currentSemesterEventsAttended,
		totalEventsAttended,
		attendedEvents,
		// checkins,
	} = userDashResult;

	const clientHeaderTimezoneValue = headers().get(
		VERCEL_IP_TIMEZONE_HEADER_KEY,
	);

	const joinedDate = formatInTimeZone(
		user.joinDate,
		clientTimeZone,
		"MMMM dd, yyyy",
	);

	const hasUserMetRequiredPoints =
		currentSemesterPoints >= c.semesters.current.pointsRequired;

	const radialChartProgressProps = {
		titleText: "Attendance Points",
		descriptionText: c.semesters.current.title,
		current: currentSemesterPoints ?? 0,
		total: c.semesters.current.pointsRequired,
		footerText: hasUserMetRequiredPoints
			? `Way to go! You have gained enough points to attend our ${c.semesters.current.title} banquet 🎉`
			: `Keep attending events to earn more points!`,
		fill: "#3b82f6",
	};

	const slicedEvents = attendedEvents.slice(0, 5);

	return (
		<div className="flex flex-col">
			<div>
				<h2 className="text-xl font-bold">Welcome,</h2>
				<h1 className="pb-5 text-5xl font-black">{user.firstName}</h1>
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				<Card className="md:col-span-1">
					<CardHeader>
						<CardTitle>Profile</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row items-center gap-5">
						<Avatar className="h-20 w-20">
							<AvatarImage src={""} alt={user.firstName} />
							<AvatarFallback>
								{`${user.firstName.trim().charAt(0) + user.lastName.trim().charAt(0)}`}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<h2 className="text-xl font-semibold">
								{user.firstName} {user.lastName}
							</h2>
							<p className="mt-1 flex items-center text-sm text-muted-foreground">
								<GraduationCapIcon className="mr-2 h-4 w-4" />
								{`${userData.major}, ${userData.graduationYear}`}
							</p>
							<p className="text-balance mt-2 flex items-center text-base text-muted-foreground">
								{`Member since ${joinedDate}`}
							</p>
							{/* <Button
									variant="outline"
									size="sm"
									className="mt-2 opacity-0">
									Edit Profile
								</Button> */}
						</div>
					</CardContent>
				</Card>

				<RadialChartProgress {...radialChartProgressProps} />

				<Card className="md:col-span-2 xl:col-span-1">
					<CardHeader className="pb-3 md:pb-6">
						<CardTitle> Recent Activity </CardTitle>
						{/* md:flex-row md:items-center */}
						<div className="flex w-full flex-col items-start justify-between gap-y-[2px] border-b border-muted py-2 text-muted-foreground   md:justify-between md:gap-6 md:gap-y-0">
							{/* md:flex */}
							<p className=" flex-col items-center justify-center">
								<span className="font-semibold text-primary">
									{currentSemesterEventsAttended}
								</span>{" "}
								Events attended this semester
							</p>
							{/* md:flex */}
							<p className="flex-col items-center justify-center ">
								<span className="font-semibold text-primary">
									{totalEventsAttended}
								</span>{" "}
								Total events attented
							</p>
						</div>
					</CardHeader>
					<CardContent>
						{attendedEvents.length > 0 && (
							<div className="flex flex-col space-y-2">
								{slicedEvents?.map((event, index) => (
									<Link
										href={`events/${event.id}`}
										key={index}
										className="rounded-md border-b border-muted p-1 pb-4 hover:underline"
									>
										{event.name}
									</Link>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
