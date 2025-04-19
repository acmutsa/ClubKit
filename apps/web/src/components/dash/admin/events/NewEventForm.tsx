"use client";

import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
	FormDescription
} from "@/components/ui/form";
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from "@/components/ui/MultiSelect";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchemaFormified } from "db/zod";
import { FormGroupWrapper } from "@/components/shared/form-group-wrapper";
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker";
import c, { staticUploads } from "config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { put } from "@/lib/client/file-upload";
import { createEvent } from "@/actions/events/createNewEvent";
import { ONE_HOUR_IN_MILLISECONDS } from "@/lib/constants";
import type { NewEventFormProps } from "@/lib/types/events";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { isAfter, isBefore, addHours, set } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image"


const formSchema = insertEventSchemaFormified;

export default function NewEventForm({
	defaultDate,
	categoryOptions,
	semesterOptions,
}: NewEventFormProps) {
	const [error, setError] = useState<{
		title: string;
		description: string;
	} | null>(null);
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState<"upload" | "select">(
		"upload",
	);
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [hasDifferentCheckinTime, setHasDifferentCheckinTime] = useState(false);
	const [existingCategoryName, setExistingCategoryName] = useState("Default")

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			description: "",
			start: defaultDate,
			checkinStart: defaultDate,
			end: new Date(defaultDate.getTime() + ONE_HOUR_IN_MILLISECONDS),
			checkinEnd: new Date(
				defaultDate.getTime() + ONE_HOUR_IN_MILLISECONDS,
			),
			thumbnailUrl: c.thumbnails.default,
			categories: [],
			isUserCheckinable: true,
			points: 1,
		},
	});
	

	function validateAndSetThumbnail(
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		const file = event.target.files?.[0];
		if (!file) {
			setThumbnail(null);
			return false;
		}
		if (file.size > c.thumbnails.maxSizeInBytes) {
			form.setError("thumbnailUrl", {
				message: "thumbnail file is too large.",
			});
			setThumbnail(null);
			return false;
		}
		if (!c.thumbnails.acceptedFiles.includes(file.type as any)) {
			form.setError("thumbnailUrl", {
				message:
					`Invalid image format. Only ${c.thumbnails.acceptedFiles.join(
															",",
														)}.`,
			});
			setThumbnail(null);
			return false;
		}
		form.clearErrors("thumbnailUrl");
		setThumbnail(file);
		return true;
	}

	const eventStartTime = form.watch("start");
	const eventEndTime = form.watch("end");
	const checkinStartTime = form.watch("checkinStart");
	const checkinEndTime = form.watch("checkinEnd");

	useEffect(() => {
		if (isAfter(eventStartTime, eventEndTime)) {
			form.setValue("end", addHours(eventStartTime, 1));
		}
	}, [eventStartTime]);

	useEffect(() => {
		if (
			isAfter(checkinStartTime, checkinEndTime) &&
			hasDifferentCheckinTime
		) {
			form.setValue("checkinEnd", addHours(checkinStartTime, 1));
		}
	}, [checkinStartTime]);

	useEffect(() => {
		if (isBefore(checkinEndTime, eventEndTime) && hasDifferentCheckinTime) {
			form.setValue("checkinStart", eventStartTime);
			form.setValue("checkinEnd", eventEndTime);
		}
	}, [eventEndTime]);

	const {
		execute: runCreateEvent,
		status: actionStatus,
		result: actionResult,
		reset: resetAction,
	} = useAction(createEvent, {
		onSuccess: async ({ data }) => {
			
			if (!data) {
				toast.error(
					`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
				);
				resetAction();
				return;
			}
			const { success, code, eventID } = data;
			if (!success) {
				switch (code) {
					case "insert_event_failed":
						setError({
							title: "Creating event failed",
							description: `Attempt to create event has failed. Please try again or contact ${c.contactEmail}.`,
						});
						break;
					default:
						toast.error(
							`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
						);
						setError({
							title: "Some error",
							description: "Error occured",
						});
						break;
				}
				resetAction();
				return;
			}
			toast.success("Event Created successfully!", {
				description: "You'll be redirected shortly.",
			});
			setTimeout(() => {
				router.push(`/events/${eventID}`);
			}, 1500);
		},
		onError: async (error) => {
			toast.error(
				`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
			);
			resetAction();
		},
		onSettled:() =>{
			toast.dismiss();
		}
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		toast.loading("Creating Event...");
		const checkinStart = hasDifferentCheckinTime
			? values.checkinStart
			: values.start;
		const checkinEnd = hasDifferentCheckinTime
			? values.checkinEnd
			: values.end;
		if (thumbnail && selectedTab === "upload") {
			const thumbnailBlob = await put(
				staticUploads.bucketEventThumbnailBaseUrl,
				thumbnail,
				{
					presignHandlerUrl: "/api/upload/thumbnail",
				},
			);
			form.setValue("thumbnailUrl", thumbnailBlob);
		}
		runCreateEvent({
			...values,
			checkinStart,
			checkinEnd,
			categories: values.categories.map((cat) => categoryOptions[cat].id),
		});
	};

	return (
		<>
			<AlertDialog open={error != null}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{error?.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{error?.description}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={() => setError(null)}>
							Ok
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<div className="text-foreground">
				<Form {...form}>
					<form
						className="space-y-8"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormGroupWrapper title="Basic Info">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="thumbnailUrl"
								render={({
									field: { value, onChange, ...fieldProps },
								}) => (
									<FormItem className="space-y-3">
										<FormLabel>Thumbnail</FormLabel>
										<Tabs
											defaultValue="upload"
											className="rounded-lg border-2 border-muted p-3"
											value={selectedTab}
											onValueChange={(value) =>
												setSelectedTab(
													value as
														| "upload"
														| "select",
												)
											}
										>
											<TabsList className="grid w-full grid-cols-2">
												<TabsTrigger
													value="upload"
													onClick={() => {
														setSelectedTab(
															"upload",
														);
													}}
												>
													New Thumbnail
												</TabsTrigger>
												<TabsTrigger
													value="select"
													onClick={() => {
														setSelectedTab(
															"select",
														);
														form.clearErrors(
															"thumbnailUrl",
														);
													}}
												>
													Use Existing
												</TabsTrigger>
											</TabsList>
											<TabsContent
												value="upload"
												forceMount
												className={`${selectedTab !== "upload" && "hidden"}`}
											>
												<FormControl className="mt-2">
													<Input
														{...fieldProps}
														type="file"
														accept={`${c.thumbnails.acceptedFiles.join(
															",",
														)}`}
														onChange={(event) => {
															const success =
																validateAndSetThumbnail(
																	event,
																);
															console.log(
																event.target
																	.value,
															);
															if (!success) {
																event.target.value =
																	"";
															}
														}}
													/>
												</FormControl>
											</TabsContent>
											<TabsContent
												value="select"
												forceMount
												className={`${selectedTab !== "select" && "hidden"}`}
											>
												<Select
													onValueChange={(value) => {
														console.log(value);
														form.setValue(
															"thumbnailUrl",
															categoryOptions[
																value
															]?.thumbnailUrl ??
																c.thumbnails
																	.default,
														);
														setExistingCategoryName(
															value,
														);
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder="Choose From Existing">
															<div className="flex w-full flex-row items-center justify-center gap-x-4">
																<p>
																	{
																		existingCategoryName
																	}
																</p>
																<Image
																	src={
																		form.getValues(
																			"thumbnailUrl",
																		) ??
																		c
																			.thumbnails
																			.default
																	}
																	width={32}
																	height={20}
																	alt={`Catgory Image for ${existingCategoryName}`}
																/>
															</div>
														</SelectValue>
													</SelectTrigger>
													<SelectContent>
														{Object.entries(
															categoryOptions,
														).map(
															([
																name,
																{
																	id,
																	thumbnailUrl,
																},
															]) => (
																<SelectItem
																	key={id}
																	value={name}
																>
																	<div className="flex w-[--radix-select-trigger-width] flex-col items-center justify-center">
																		<Image
																			src={
																				thumbnailUrl
																			}
																			width={
																				32
																			}
																			height={
																				20
																			}
																			alt={`Catgory Image for ${name}`}
																		/>
																		<p className="">
																			{
																				name
																			}
																		</p>
																	</div>
																</SelectItem>
															),
														)}
														<SelectItem value="Default">
															<div className="flex w-[--radix-select-trigger-width] flex-col items-center justify-center ">
																<Image
																	src={
																		c
																			.thumbnails
																			.default
																	}
																	width={32}
																	height={20}
																	alt={`Catgory Image for ${c.thumbnails.default}`}
																/>
																<p className="">
																	Default
																</p>
															</div>
														</SelectItem>
													</SelectContent>
												</Select>
											</TabsContent>
										</Tabs>
										<FormMessage />
										<FormDescription
											className="flex flex-row items-center gap-x-2"
										>
											If no thumbnail is selected, the
											default image
											<Image
												src={c.thumbnails.default}
												className="hidden sm:inline"
												width={30}
												height={20}
												alt="Default image"
											/>{" "}
											will be used
										</FormDescription>
									</FormItem>
								)}
							/>
						</FormGroupWrapper>
						<FormGroupWrapper title="Time & Location">
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="start"
									render={({ field }) => (
										<FormItem className="col-span-2 sm:col-span-1">
											<FormLabel>Start</FormLabel>
											<FormControl>
												<DateTimePicker
													value={
														!!field.value
															? parseAbsolute(
																	field.value.toISOString(),
																	getLocalTimeZone(),
																)
															: null
													}
													onChange={(date) => {
														field.onChange(
															!!date
																? date.toDate(
																		getLocalTimeZone(),
																	)
																: null,
														);
													}}
													shouldCloseOnSelect={false}
													granularity={"minute"}
													label="Event Start"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="end"
									render={({ field }) => (
										<FormItem className="col-span-2 sm:col-span-1">
											<FormLabel>End</FormLabel>
											<FormControl>
												<DateTimePicker
													value={
														!!field.value
															? parseAbsolute(
																	field.value.toISOString(),
																	getLocalTimeZone(),
																)
															: null
													}
													onChange={(date) => {
														field.onChange(
															!!date
																? date.toDate(
																		getLocalTimeZone(),
																	)
																: null,
														);
													}}
													shouldCloseOnSelect={false}
													granularity={"minute"}
													label="Event End"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className="flex items-center gap-x-2">
								<FormLabel>
									Use Different Check-In Time?
								</FormLabel>
								<Switch
									checked={hasDifferentCheckinTime}
									onCheckedChange={() => {
										setHasDifferentCheckinTime(
											(prev) => !prev,
										);
									}}
									aria-readonly
								/>
							</div>
							{hasDifferentCheckinTime && (
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="checkinStart"
										render={({ field }) => (
											<FormItem className="col-span-2 sm:col-span-1">
												<FormLabel>
													Check-In Start
												</FormLabel>
												<FormControl>
													<DateTimePicker
														value={
															!!field.value
																? parseAbsolute(
																		field.value.toISOString(),
																		getLocalTimeZone(),
																	)
																: null
														}
														onChange={(date) => {
															field.onChange(
																!!date
																	? date.toDate(
																			getLocalTimeZone(),
																		)
																	: null,
															);
														}}
														shouldCloseOnSelect={
															false
														}
														granularity={"minute"}
														label="Check-In Start"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="checkinEnd"
										render={({ field }) => (
											<FormItem className="col-span-2 sm:col-span-1">
												<FormLabel>
													Check-In End
												</FormLabel>
												<FormControl>
													<DateTimePicker
														value={
															!!field.value
																? parseAbsolute(
																		field.value.toISOString(),
																		getLocalTimeZone(),
																	)
																: null
														}
														onChange={(date) => {
															field.onChange(
																!!date
																	? date.toDate(
																			getLocalTimeZone(),
																		)
																	: null,
															);
														}}
														shouldCloseOnSelect={
															false
														}
														granularity={"minute"}
														label="Check-In End"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							)}
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location</FormLabel>
										<Input
											{...field}
											placeholder="Ex: ACM Room"
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</FormGroupWrapper>
						<FormGroupWrapper title="Additional">
							{semesterOptions.length > 0 && (
								<FormField
									name="semesterID"
									control={form.control}
									render={({ field }) => (
										<FormItem>
											<FormLabel>Semester</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => {
														console.log(value);
														field.onChange(
															parseInt(value, 10),
														);
													}}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select a Semester" />
													</SelectTrigger>
													<SelectContent>
														{semesterOptions.map(
															({
																name,
																semesterID,
															}) => (
																<SelectItem
																	key={
																		semesterID
																	}
																	value={semesterID.toString()}
																>
																	{name}
																</SelectItem>
															),
														)}
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							)}
							<FormField
								name="categories"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex flex-col justify-between gap-y-1">
										<FormLabel>Categories</FormLabel>
										<MultiSelector
											onValuesChange={field.onChange}
											values={field.value}
											loop={true}
										>
											<MultiSelectorTrigger>
												<MultiSelectorInput
													className="text-sm"
													placeholder="Click to Select"
												/>
											</MultiSelectorTrigger>
											<MultiSelectorContent>
												<MultiSelectorList>
													{Object.entries(
														categoryOptions,
													).map(([name, { id }]) => (
														<MultiSelectorItem
															key={id}
															value={name}
														>
															{name}
														</MultiSelectorItem>
													))}
												</MultiSelectorList>
											</MultiSelectorContent>
										</MultiSelector>
									</FormItem>
								)}
							/>
							<FormField
								name="points"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Points</FormLabel>
										<FormControl>
											<Input
												type="number"
												className="max-w-[25%]"
												min={c.minEventPoints}
												max={c.maxEventPoints}
												{...field}
												onChange={(e) => {
													const parsedPoints =
														parseInt(
															e.target.value,
															10,
														);
													const points =
														parsedPoints < 1
															? 1
															: parsedPoints;
													field.onChange(points);
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="isUserCheckinable"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex w-1/2  items-center justify-between sm:w-1/4">
										<FormLabel>Check-In</FormLabel>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											aria-readonly
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="isHidden"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex w-1/2 items-center justify-between sm:w-1/4">
										<FormLabel>Hidden</FormLabel>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											aria-readonly
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</FormGroupWrapper>

						<p className="text-medium text-destructive">
							{form.formState.errors.root?.message}
						</p>

						<Button
							disabled={
								actionStatus == "executing" ||
								(actionStatus == "hasSucceeded" &&
									actionResult.data?.success)
							}
							type="submit"
						>
							Submit
						</Button>
					</form>
				</Form>
			</div>
		</>
	);
}
