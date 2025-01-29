"use client";
import c, { majors } from "config";
import { Button } from "@/components/ui/button";
import { insertUserWithDataSchemaFormified } from "db/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarWithYears } from "@/components/ui/calendarWithYearSelect";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from "@/components/ui/MultiSelect";
import { FormGroupWrapper } from "@/components/shared/form-group-wrapper";
import {
	Check,
	ChevronsUpDown,
	CalendarIcon,
	TriangleAlert,
} from "lucide-react";
import { cn, range } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createRegistration } from "@/actions/register/new";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import FormDisplayName from "../shared/FormDisplayName";
import { bucketBaseUrl } from "config";
import { ClassificationType, MajorType } from "@/lib/types/shared";

const formSchema = insertUserWithDataSchemaFormified;

interface RegisterFormProps {
	defaultEmail: string;
}

export default function RegisterForm({ defaultEmail }: RegisterFormProps) {
	const [error, setError] = useState<{
		title: string;
		description: string;
	} | null>(null);
	const [resume, setResume] = useState<File | null>(null);
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: defaultEmail,
			firstName: "",
			lastName: "",
			data: {
				major: "" as MajorType,
				classification: "" as ClassificationType,
				gender: [],
				ethnicity: [],
				universityID: "",
			},
		},
	});

	const {
		execute: runCreateRegistration,
		status: actionStatus,
		result: actionResult,
		reset: resetAction,
	} = useAction(createRegistration, {
		onSuccess: async ({ data }) => {
			toast.dismiss();

			if (!data?.success) {
				const code = data?.code || "unknown";
				switch (code) {
					case "user_already_exists":
						setError({
							title: "User Already Exists",
							description: `It would seem you have already registered. If you believe this is an error, please contact ${c.contactEmail}.`,
						});
						break;
					case "email_already_exists":
						setError({
							title: "Email Already Exists",
							description: `${form.getValues().email} There is already an account with that email address. This could mean you have already registered, or that you have a legacy portal account that needs to be connected. If you belive this is an error, please contact ${c.contactEmail}.`,
						});
						break;
					case "university_id_already_exists":
						setError({
							title: `${c.universityID.name} Already Exists`,
							description: `There is already an account with the ${c.universityID.name} of ${form.getValues().data.universityID}. This could mean you have already registered, or that you have a legacy portal account that needs to be connected. If you belive this is an error, please contact ${c.contactEmail}.`,
						});
						break;
					default:
						toast.error(
							`An unknown error occurred. Please try again or contact ${c.contactEmail}.`,
						);
						break;
				}
				resetAction();
				return;
			}
			toast.success("Registration successful!", {
				description: "You'll be redirected shortly.",
			});
			setTimeout(() => {
				router.push("/dash");
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

	useEffect(() => {
		if (Object.keys(form.formState.errors).length > 0) {
			console.log("Errors: ", form.formState.errors);
		}
	}, [form.formState]);

	async function onSubmit(values: z.infer<typeof formSchema>) {
		toast.loading("Creating Registration...");
		if (resume) {
			const resumeBlob = await upload(
				`${bucketBaseUrl}/resume/${resume.name}`,
				resume,
				{
					access: "public",
					handleUploadUrl: "/api/upload/resume",
				},
			);
			values.data.resume = resumeBlob.url;
		}
		runCreateRegistration(values);
	}

	function validateAndSetResume(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0];
		if (!file) {
			setResume(null);
			return false;
		}
		if (file.size > c.maxResumeSizeInBytes) {
			form.setError("data.resume", {
				message: "Resume file is too large.",
			});
			setResume(null);
			return false;
		}
		if (!c.acceptedResumeMimeTypes.includes(file.type)) {
			form.setError("data.resume", {
				message: "Resume file must be a .pdf or .docx file.",
			});
			setResume(null);
			return false;
		}
		setResume(file);
		return true;
	}

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
			<div className="mt-12">
				<Form {...form}>
					<form
						className="space-y-8"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormGroupWrapper title="Basic Info">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<FormField
									control={form.control}
									name="firstName"
									render={({ field }) => (
										<FormItem>
											<FormDisplayName
												displayName="First Name"
												required={
													formSchema.shape[
														field.name
													].isOptional() ?? false
												}
											/>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastName"
									render={({ field }) => (
										<FormItem>
											<FormDisplayName
												displayName="Last Name"
												required={
													formSchema.shape[
														field.name
													].isOptional() ?? false
												}
											/>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormDisplayName
												displayName="Email"
												required={
													formSchema.shape[
														field.name
													].isOptional() ?? false
												}
											/>
											<FormControl>
												<Input {...field} disabled />
											</FormControl>
											<p className="text-xs text-muted-foreground">
												This field cannot be changed.
											</p>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</FormGroupWrapper>
						<FormGroupWrapper title="University Information">
							<div className="grid grid-cols-3 gap-4 md:grid-cols-6">
								<FormField
									control={form.control}
									name="data.universityID"
									render={({ field }) => (
										<FormItem className="col-span-3 md:col-span-2">
											<FormLabel>
												{`${c.universityID.name} *`}
											</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.major"
									render={({ field }) => (
										<FormItem className="col-span-3 md:col-span-2">
											<FormLabel>Major *</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant="outline"
															role="combobox"
															className={cn(
																"w-full justify-between",
																!field.value &&
																	"text-muted-foreground",
															)}
														>
															{field.value
																? majors.find(
																		(
																			major,
																		) =>
																			major ===
																			field.value,
																	)
																: "Select a Major"}
															<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent className="max-h-[400px] w-[250px] p-0 no-scrollbar">
													<Command>
														<CommandInput placeholder="Search major..." />
														<CommandEmpty>
															No major found.
														</CommandEmpty>
														<CommandList>
															<CommandGroup>
																{majors.map(
																	(major) => {
																		return (
																			<CommandItem
																				value={
																					major
																				}
																				key={
																					major
																				}
																				onSelect={(
																					value,
																				) => {
																					form.setValue(
																						"data.major",
																						value as MajorType,
																					);
																					form.clearErrors(
																						"data.major",
																					);
																				}}
																				className="cursor-pointer "
																			>
																				<Check
																					className={`mr-2 h-4 w-4 overflow-hidden ${
																						major.toLowerCase() ===
																						field.value
																							? "block"
																							: "hidden"
																					}
																		`}
																				/>
																				{
																					major
																				}
																			</CommandItem>
																		);
																	},
																)}
															</CommandGroup>
														</CommandList>
													</Command>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.classification"
									render={({ field }) => (
										<FormItem className="col-span-3 md:col-span-2">
											<FormLabel>
												Classification *
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a classification" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{c.userIdentityOptions.classification.map(
														(
															classification,
															index,
														) => (
															<SelectItem
																key={
																	classification
																}
																value={
																	classification
																}
															>
																{classification}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.graduationMonth"
									render={({ field }) => (
										<FormItem className="col-span-3">
											<FormLabel>
												Graduation Month *
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Month" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem
														className="cursor-pointer"
														value="1"
													>
														January
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="2"
													>
														February
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="3"
													>
														March
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="4"
													>
														April
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="5"
													>
														May
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="6"
													>
														June
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="7"
													>
														July
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="8"
													>
														August
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="9"
													>
														September
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="10"
													>
														October
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="11"
													>
														November
													</SelectItem>
													<SelectItem
														className="cursor-pointer"
														value="12"
													>
														December
													</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.graduationYear"
									render={({ field }) => (
										<FormItem className="col-span-3">
											<FormLabel className="w-full">
												Graduation Year *
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Year" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{range(
														new Date().getFullYear(),
														new Date().getFullYear() +
															5,
													).map((year) => (
														<SelectItem
															className="cursor-pointer"
															value={year.toString()}
															key={year}
														>
															{year}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</FormGroupWrapper>
						<FormGroupWrapper title="Personal Information">
							<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
								<FormField
									control={form.control}
									name="data.birthday"
									render={({ field }) => (
										<FormItem className="flex flex-col space-y-1">
											<FormLabel>Birthday</FormLabel>
											<Popover>
												<PopoverTrigger asChild>
													<FormControl>
														<Button
															variant={"outline"}
															className={cn(
																"pl-3 text-left font-normal",
																!field.value &&
																	"text-muted-foreground",
															)}
														>
															{field.value ? (
																format(
																	field.value,
																	"PPP",
																)
															) : (
																<span>
																	Pick a Date
																</span>
															)}
															<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
														</Button>
													</FormControl>
												</PopoverTrigger>
												<PopoverContent
													className="w-auto p-0"
													align="start"
												>
													<CalendarWithYears
														captionLayout="dropdown-buttons"
														mode="single"
														selected={
															field.value == null
																? undefined
																: field.value
														}
														onSelect={
															field.onChange
														}
														disabled={(date) =>
															date > new Date() ||
															date <
																new Date(
																	"1900-01-01",
																)
														}
														fromYear={
															new Date().getFullYear() -
															100
														}
														toYear={new Date().getFullYear()}
														initialFocus
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.gender"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-col justify-between gap-y-1">
												<FormLabel>Gender *</FormLabel>
												<MultiSelector
													onValuesChange={
														field.onChange
													}
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
															{c.userIdentityOptions.gender.map(
																(
																	value,
																	index,
																) => (
																	<MultiSelectorItem
																		key={
																			value
																		}
																		value={
																			value
																		}
																	>
																		{value}
																	</MultiSelectorItem>
																),
															)}
														</MultiSelectorList>
													</MultiSelectorContent>
												</MultiSelector>
												<FormMessage />
											</FormItem>
										);
									}}
								/>

								<FormField
									control={form.control}
									name="data.ethnicity"
									render={({ field }) => {
										return (
											<FormItem className="flex flex-col justify-between gap-y-1">
												<FormLabel>
													Ethnicity *
												</FormLabel>
												<MultiSelector
													onValuesChange={
														field.onChange
													}
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
															{c.userIdentityOptions.ethnicity.map(
																(
																	value,
																	index,
																) => (
																	<MultiSelectorItem
																		key={
																			value
																		}
																		value={
																			value
																		}
																	>
																		{value}
																	</MultiSelectorItem>
																),
															)}
														</MultiSelectorList>
													</MultiSelectorContent>
												</MultiSelector>
												<FormMessage />
											</FormItem>
										);
									}}
								/>
							</div>
						</FormGroupWrapper>
						<FormGroupWrapper title="Other">
							<div className="grid grid-cols-3 gap-4">
								<FormField
									control={form.control}
									name="data.shirtSize"
									render={({ field }) => (
										<FormItem className="col-span-3 md:col-span-1">
											<FormLabel>Shirt Size *</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a size" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{c.userIdentityOptions.shirtSize.map(
														(size) => (
															<SelectItem
																className="cursor-pointer"
																value={size}
																key={size}
															>
																{size}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.shirtType"
									render={({ field }) => (
										<FormItem className="col-span-3 md:col-span-1">
											<FormLabel>Shirt Type * </FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value?.toString()}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select a type" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{c.userIdentityOptions.shirtType.map(
														(type) => (
															<SelectItem
																className="cursor-pointer"
																value={type}
																key={type}
															>
																{type}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="data.resume"
									render={({
										field: {
											value,
											onChange,
											...fieldProps
										},
									}) => (
										<FormItem className="col-span-3 md:col-span-1">
											<FormLabel>Resume</FormLabel>
											<FormControl>
												<Input
													{...fieldProps}
													type="file"
													accept={c.acceptedResumeMimeTypes.toLocaleString()}
													onChange={(event) => {
														const success =
															validateAndSetResume(
																event,
															);
														if (!success) {
															event.target.value =
																"";
														}
													}}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</FormGroupWrapper>

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
