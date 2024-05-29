import Events from "@/components/events/Events";


export default function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | undefined };
}) {
    
	return <Events searchParams={searchParams} />;
}