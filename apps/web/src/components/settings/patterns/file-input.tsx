import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

interface FileUploadProps {
	showCurrent?: boolean;
	className?: string;
	currentFileName?: string;
	currentLink?: string;
	fileValue?: File;
	accept?: string;
	onChange: (file?: File) => void;
}

export function FileInput({
	showCurrent,
	currentLink,
	className,
	currentFileName,
	fileValue,
	accept,
	onChange,
}: FileUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (inputRef.current) {
			const dataTransfer = new DataTransfer();
			fileValue && dataTransfer.items.add(fileValue);
			inputRef.current.files = dataTransfer.files;
		}
	}, [fileValue]);

	return (
		<div className={cn(className, "space-y-2")}>
			{showCurrent && (
				<div className="flex items-center">
					<Badge
						className={cn(
							fileValue && "bg-destructive text-primary",
						)}
					>
						Current
					</Badge>
					{currentLink ? (
						<a
							href={currentLink}
							className={cn(
								"ml-2 text-muted-foreground underline",
								fileValue && "line-through",
							)}
						>
							{currentFileName ?? "No file uploaded"}
						</a>
					) : (
						<p
							className={cn(
								"ml-2 text-muted-foreground",
								fileValue && "line-through",
							)}
						>
							{currentFileName ?? "No file uploaded"}
						</p>
					)}
				</div>
			)}
			{fileValue && (
				<div className="flex items-center">
					<Badge>New</Badge>
					<p className="ml-2 text-muted-foreground">
						{fileValue?.name}
					</p>
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
