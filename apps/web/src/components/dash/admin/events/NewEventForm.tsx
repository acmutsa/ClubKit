"use client";
import {
	Form,
	FormField,
	FormItem,
	FormControl,
	FormLabel,
	FormMessage,
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
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { getLocalTimeZone, parseAbsolute } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertEventSchema, insertEventSchemaFormified } from "db/zod";
import { CalendarWithYears } from "@/components/ui/calendarWithYearSelect";
import { FormGroupWrapper } from "@/components/shared/form-group-wrapper";
import { DateTimePicker } from "@/components/ui/date-time-picker/date-time-picker";
import c from "config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { upload } from "@vercel/blob/client";
import { createEvent } from "@/actions/events/new";
import { ONE_HOUR_IN_MILLISECONDS } from "@/lib/constants/shared";

type NewEventFormProps = {
	defaultDate: Date;
	categoryOptions: { [key: string]: string };
};

const formSchema = insertEventSchemaFormified;

export default function NewEventForm({
	defaultDate,
	categoryOptions,
}: NewEventFormProps) {
	const [error, setError] = useState<{
		title: string;
		description: string;
	} | null>(null);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			start: defaultDate,
			checkinStart: defaultDate,
			end: new Date(defaultDate.getTime() + ONE_HOUR_IN_MILLISECONDS),
			checkinEnd: new Date(defaultDate.getTime() + ONE_HOUR_IN_MILLISECONDS),
			thumbnailUrl: c.thumbnails.default,
			categories: [],
			isUserCheckinable: true,
		},
	});
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [differentCheckinTime, setDifferentCheckinTime] = useState(false);

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
		if (
			![
				"image/jpeg",
				"image/png",
				"image/gif",
				"image/webp",
				"image/svg+xml",
				"image/bmp",
			].includes(file.type)
		) {
			form.setError("thumbnailUrl", {
				message:
					"Invalid image format. Only jpeg, png, gif, webp, svg+xml, bmp.",
			});
			setThumbnail(null);
			return false;
		}
		setThumbnail(file);
		return true;
	}

	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			console.log("Errors: ", form.formState.errors);
		}
		
	}, [form.formState]);

	const {
		execute: runCreateEvent,
		status: actionStatus,
		result: actionResult,
		reset: resetAction,
	} = useAction(createEvent, {
		onSuccess: async ({ success, code, eventID }) => {
			toast.dismiss();
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
			toast.dismiss();
			toast.error(
				`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
			);
			console.log("error: ", error);
			resetAction();
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		console.log("Submit: ", values);
		toast.loading("Creating Event...");
		if (thumbnail) {
			const thumbnailBlob = await upload(thumbnail.name, thumbnail, {
				access: "public",
				handleUploadUrl: "/api/upload/thumbnail",
			});
			runCreateEvent({
				...values,
				thumbnailUrl: thumbnailBlob.url,
				categories: values.categories.map(
					(cat) => categoryOptions[cat],
				),
			});
		} else {
			runCreateEvent({
				...values,
				categories: values.categories.map(
					(cat) => categoryOptions[cat],
				),
			});
		}
	};

	return (
		<>
			<AlertDialog open={error != null}>
				{/* <AlertDialogTrigger asChild>
					<Button variant="outline">Show Dialog</Button>
				</AlertDialogTrigger> */}
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
											<Textarea {...field}></Textarea>
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
									<FormItem>
										<FormLabel>Thumbnail</FormLabel>
										<FormControl>
											<Input
												{...fieldProps}
												type="file"
												accept="image"
												onChange={(event) => {
													const success =
														validateAndSetThumbnail(
															event,
														);
													if (!success) {
														event.target.value = "";
													}
												}}
											/>
										</FormControl>
										<FormMessage />
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
										<FormItem>
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
										<FormItem>
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
									checked={differentCheckinTime}
									onCheckedChange={() => {
										setDifferentCheckinTime(
											(prev) => !prev,
										);
									}}
									aria-readonly
								/>
							</div>
							{differentCheckinTime && (
								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="checkinStart"
										render={({ field }) => (
											<FormItem>
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
											<FormItem>
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
													).map(([name, id]) => (
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
								name="isUserCheckinable"
								control={form.control}
								render={({ field }) => (
									<FormItem className="flex w-1/4 items-center justify-between">
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
									<FormItem className="flex w-1/4 items-center justify-between">
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
