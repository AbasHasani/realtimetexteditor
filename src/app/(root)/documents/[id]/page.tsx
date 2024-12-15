import CollaborativeRoom from "@/components/CollaborativeRoom";
import { Editor } from "@/components/editor/Editor";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { FC } from "react";
import { getDocuemt } from "@/lib/room.actions";
import { getClerkUsers } from "@/lib/user.actions";

interface props {
  params: Promise<{ id: string }>;
}

const Document: FC<props> = async ({ params }) => {
  const { id } = await params;

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/");
  const room = await getDocuemt({
    roomId: id,
    userId: clerkUser.emailAddresses[0].emailAddress,
  });

  if (!room) redirect("/");
  const userIds = Object.keys(room.usersAccesses);
  const users = await getClerkUsers({ userIds });

  const usersData = users.map((user: User) => ({
    ...user,
    userType: room.usersAccesses[user.email]?.includes("room:write")
      ? "editor"
      : "viewer",
  }));
  const currentUserType = room.usersAccesses[
    clerkUser.emailAddresses[0].emailAddress
  ]?.includes("room:write")
    ? "editor"
    : "viewer";
  console.log(usersData);
  console.log(currentUserType);
  return (
    <main className="flex w-full flex-col items-center">
      <CollaborativeRoom
        roomId={id}
        roomMetadata={room.metadata}
        users={usersData}
        currentUserType={currentUserType}
      />
    </main>
  );
};

export default Document;
