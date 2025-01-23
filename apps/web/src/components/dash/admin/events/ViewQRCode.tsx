import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { useRef } from "react";
import { toast } from "sonner";

export default function ViewQRCode({ data }: any) {
	const svgRef = useRef(null);
	const svgElement = svgRef.current!;
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;
	const img = new Image();

	const copyToClipboard = async () => {
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			canvas.toBlob((blob) => {
				/*
                TS2322: Type Blob | null is not assignable to type string | Blob | PromiseLike<string | Blob>
Type null is not assignable to type string | Blob | PromiseLike<string | Blob>
                    - Unsure how to go about this error with 'image/png'
                 */
				// @ts-ignore
				navigator.clipboard
					.write([new ClipboardItem({ "image/png": blob })])
					.then(() => console.log("PNG copied to clipboard"))
					.catch((err) => console.error("Failed to copy:", err));
			});
		};
		img.src =
			"data:image/svg+xml;base64," +
			btoa(new XMLSerializer().serializeToString(svgElement));
	};

	const download = async (fileName: string) => {
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			const pngUrl = canvas.toDataURL("image/png");

			const downloadLink = document.createElement("a");
			downloadLink.href = pngUrl;
			downloadLink.download = fileName;
			document.body.appendChild(downloadLink);
			downloadLink.click();
			document.body.removeChild(downloadLink);
		};

		const svgData = new XMLSerializer().serializeToString(svgElement);
		img.src = "data:image/svg+xml;base64," + btoa(svgData);
	};

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<div onClick={(e) => e.stopPropagation()}>QR Code</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{data.name}</DialogTitle>
						<DialogDescription>
							{data.description}
						</DialogDescription>
					</DialogHeader>
					<div>
						<QRCode
							ref={svgRef}
							size={256}
							//TODO: Change to be dynamic with website address
							value={`https://localhost:3000/events/${data.id}`}
						/>
					</div>
					<DialogFooter>
						<Button
							type={"reset"}
							onClick={() => {
								toast.promise(copyToClipboard(), {
									loading: "Copying QR Code...",
									success: "QR Code copied",
									error: "Failed to copy QR Code",
								});
							}}
						>
							Copy to Clipboard
						</Button>
						<Button
							type="submit"
							onClick={() => {
								toast.promise(download(data.id), {
									loading: "Downloading QR Code...",
									success: "QR Code downloaded",
									error: "Failed to download QR Code",
								});
							}}
						>
							Download
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
