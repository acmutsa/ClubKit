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

type ViewQRCodeProps = {
	id?: string;
	name?: string;
	description?: string;
	basePath?: string;
};

export default function ViewQRCode(props: ViewQRCodeProps) {
	const { id, name, description, basePath } = props;
	const qrCodeID = `${name}-QRCode`;
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d")!;
	const img = new Image();

	const copyToClipboard = async () => {
		const svg = document.getElementById(qrCodeID);
		if (!svg) throw new Error("QR Code not found");
		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0);
			canvas.toBlob(async (blob) => {
				console.log(blob);
				await navigator.clipboard.write([
					new ClipboardItem({ "image/png": blob! }),
				]);
			});
		};
		img.src =
			"data:image/svg+xml;base64," +
			btoa(new XMLSerializer().serializeToString(svg));
	};
	const download = (fileName: string) => {
		toast.loading("Downloading QR Code...");
		try {
			const svg = document.getElementById(qrCodeID);
			if (!svg) return toast.error("QR Code not found");
			const svgData = new XMLSerializer().serializeToString(svg);
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return toast.error("Failed to create canvas context");
			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx.drawImage(img, 0, 0);
				const pngFile = canvas.toDataURL("image/png");
				const downloadLink = document.createElement("a");
				downloadLink.download = fileName;
				downloadLink.href = `${pngFile}`;
				downloadLink.click();
				toast.dismiss();
				toast.success("QR Code downloaded");
			};
			img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
		} catch (e) {
			toast.dismiss();
			console.log(e);
			toast.error("Failed to download QR Code");
		}
	};

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<div onClick={(e) => e.stopPropagation()}>QR Code</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>{name}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<div className="flex w-full items-center justify-center">
						<QRCode
							id={qrCodeID}
							size={256}
							value={`${basePath}/events/${id}`}
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
								download(qrCodeID);
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
