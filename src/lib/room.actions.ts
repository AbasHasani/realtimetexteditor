"use server";

import { nanoid } from "nanoid";
import { liveblocks } from "./liveblocks";
import { revalidatePath } from "next/cache";
import { getAccessType, parseStringify } from "./utils";
import { redirect } from "next/navigation";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  try {
    const roomId = nanoid();
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    const room = await liveblocks.createRoom(roomId, {
      metadata,
      defaultAccesses: [],
      usersAccesses,
    });

    revalidatePath("/");
    return parseStringify(room);
  } catch (error) {
    console.log("Error happend while creating a room " + error);
  }
};

export const getDocuemt = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    const hasAccess = Object.keys(room.usersAccesses).includes(userId);
    if (!hasAccess) {
      throw new Error("You dont have access to this room");
    }
    return parseStringify(room);
  } catch (error) {
    console.log("Error ABAS" + error);
  }
};

export const updateDocument = async (roomId: string, title: string) => {
  try {
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      metadata: {
        title,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log("ERROR " + error);
  }
};

export const getDocuments = async (email: string) => {
  try {
    const rooms = await liveblocks.getRooms({ userId: email });
    // const hasAccess = Object.keys(rooms.usersAccesses).includes(userId);
    // if (!hasAccess) {
    //   throw new Error("You dont have access to this room");
    // }
    return parseStringify(rooms);
  } catch (error) {
    console.log("Error ABAS" + error);
  }
};

export const updateDocumentAccess = async ({
  roomId,
  userType,
  updatedBy,
  email,
}: ShareDocumentParams) => {
  try {
    const usersAccesses: RoomAccesses = {
      [email]: getAccessType(userType) as AccessType,
    };
    const room = await liveblocks.updateRoom(roomId, {
      usersAccesses,
    });
    if (room) {
      const notificatinoId = nanoid();

      await liveblocks.triggerInboxNotification({
        userId: email,
        kind: "$documentAccess",
        subjectId: notificatinoId,
        activityData: {
          userType,
          title: `You have been granted ${userType} access to the document by ${updatedBy.name}`,
          email: updatedBy.email,
          avatar: updatedBy.avatar,
        },
        roomId,
      });
    }
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(room);
  } catch (error) {
    console.log("123345687" + error);
  }
};

export const removeCollaborator = async ({
  roomId,
  email,
}: {
  roomId: string;
  email: string;
}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    if (room.metadata.email === email) {
      throw new Error("You cant remove yourself from the room");
    }
    const updatedRoom = await liveblocks.updateRoom(roomId, {
      usersAccesses: {
        [email]: null,
      },
    });
    revalidatePath(`/documents/${roomId}`);
    return parseStringify(updatedRoom);
  } catch (error) {
    console.log(error);
  }
};

export const deleteDocument = async (roomId: string) => {
  try {
    await liveblocks.deleteRoom(roomId);
    revalidatePath("/");
    redirect("/");
  } catch (error) {}
};
