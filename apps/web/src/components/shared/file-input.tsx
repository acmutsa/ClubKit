import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface FileUploadProps {
	showCurrent?: boolean;
	className?: string;
	currentFileName?: string;
	currentLink?: string;
	fileValue?: File | null;
	accept?: string;
	onChange: (file?: File) => void;
	onRemove?: () => void;
}

export function FileInput({
	showCurrent,
	currentLink,
	className,
	currentFileName,
	fileValue,
	accept,
	onChange,
	onRemove,
}: FileUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			const dataTransfer = new DataTransfer();
			fileValue && dataTransfer.items.add(fileValue);
			inputRef.current.files = dataTransfer.files;
		}
	}, [fileValue]);

	const oldFileInvalidated = fileValue !== undefined;

	return (
		<div className={cn(className, "space-y-2")}>
			{showCurrent && (
				<div className="flex items-center justify-between lg:justify-start lg:gap-2">
					<div className="flex">
						<Badge
							className={cn(
								oldFileInvalidated &&
									"bg-destructive text-primary",
							)}
						>
							{oldFileInvalidated
								? `Will be ${fileValue === null ? "deleted" : "updated"}`
								: "Current"}
						</Badge>
						<div className="overflow-auto whitespace-nowrap">
							<div className="w-32 lg:w-full">
								{currentLink ? (
									<a
										href={currentLink}
										className={cn(
											"ml-2 block min-w-max text-muted-foreground underline",
											oldFileInvalidated &&
												"line-through",
										)}
									>
										{currentFileName ?? "No file uploaded"}
									</a>
								) : (
									<p
										className={cn(
											"ml-2 text-muted-foreground",
											oldFileInvalidated &&
												"line-through",
										)}
									>
										{currentFileName ?? "No file uploaded"}
									</p>
								)}
							</div>
						</div>
					</div>
					{onRemove && currentFileName && (
						<Button
							variant="ghost"
							type="button"
							className="h-5 p-0"
							onClick={() => onRemove()}
						>
							<Trash2 className="h-5 w-5" />
						</Button>
					)}
				</div>
			)}
			{fileValue && (
				<div className="flex">
					<Badge>New</Badge>
					<div className="overflow-auto whitespace-nowrap">
						<p className="ml-2 text-muted-foreground">
							{fileValue?.name}
						</p>
					</div>
				</div>
			)}
			<Input
				type="file"
				ref={inputRef}
				className="text-md cursor-pointer"
				onChange={(e) => {
					onChange(e.target.files?.[0]);
				}}
				accept={accept}
			/>
		</div>
	);
}
