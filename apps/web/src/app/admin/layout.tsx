import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "db";
import { users } from "db/schema";
import { eq } from "db/drizzle";
import FullScreenMessage from "@/components/shared/fullscreen-message";
import ClientToast from "@/components/shared/client-toast";
import {Button} from "@/components/ui/button";
import c from "config";
import { Home } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { userId } = auth();

  // if (!userId) {
  //   return redirect("/sign-in");
  // }

  // const user = await db.query.users.findFirst({
  //   where: eq(users.clerkID, userId),
  // });

  // if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
  //   console.log("Denying admin access to user", user);
  //   return (
  //     <FullScreenMessage
  //       title="Access Denied"
  //       message="You are not an admin. If you belive this is a mistake, please contact a administrator."
  //     />
  //   );
  // }
  return (
    <>
      <ClientToast />
      <div className="w-full h-16 px-5 grid grid-cols-2 bg-nav border border-bottom fixed z-20">
        <div className="flex items-center gap-x-4 bg-nav">
          <Image
            src={c.icon.svg}
            alt={c.clubName + " Logo"}
            width={32}
            height={32}
          />
          <div className="bg-muted-foreground h-[45%] rotate-[25deg] w-[2px]" />
          <h2 className="font-bold tracking-tight">Admin</h2>
        </div>
        <div className="md:flex items-center justify-end hidden">
          <Link href={"/"}>
            <Button className="text-nav-content bg-nav hover:bg-nav-content/70 hover:text-nav-content/70" size={"icon"}>
              <Home />
            </Button>
          </Link>
        </div>
      </div>
      <div>
        {children}
      </div>
    </>
  );
}
