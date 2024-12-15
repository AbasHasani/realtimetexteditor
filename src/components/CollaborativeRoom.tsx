"use client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Editor } from "./editor/Editor";
import ActiveCollaboratives from "./ActiveCollaboratives";
import { Input } from "./ui/input";
import Image from "next/image";
import { updateDocument } from "@/lib/room.actions";
import Loader from "./Loader";
import ShareModal from "./ShareModal";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
  currentUserType,
  users,
}: CollaborativeRoomProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateTitleHandler = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setLoading(true);

      try {
        if (documentTitle != roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle);
          if (updatedDocument) {
            setEditing(false);
          }
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const handleClicksOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    };
    document.addEventListener("mousedown", handleClicksOutside);
    return () => {
      document.addEventListener("mousedown", handleClicksOutside);
    };
  }, [documentTitle, roomId]);
  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <Input
                  type="text"
                  ref={inputRef}
                  value={documentTitle}
                  placeholder="Enter title"
                  onKeyDown={updateTitleHandler}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <>
                  <p className="document-title">{documentTitle}</p>
                </>
              )}
              {currentUserType === "editor" && !editing && (
                <Image
                  src="/assets/icons/edit.svg"
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  alt=""
                  className="pointer"
                />
              )}
              {currentUserType != "editor" && !editing && (
                <p className="view-only-tag">View only</p>
              )}
              {loading && <p className="text-sm text-gray-400">Saving...</p>}
            </div>
            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaboratives />
              <ShareModal
                roomId={roomId}
                collaborators={users}
                creatorId={roomMetadata.creatorId}
                currentUserType={currentUserType}
              />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor roomId={roomId} currentUserType={currentUserType} />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
