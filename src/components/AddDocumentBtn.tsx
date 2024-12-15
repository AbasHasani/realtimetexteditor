"use client";
import React, { FC } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import { createDocument } from "@/lib/room.actions";
import { useRouter } from "next/navigation";

const AddDocumentBtn: FC<AddDocumentBtnProps> = ({ email, userId }) => {
  const router = useRouter()
  const addDocumentHandler = async () => {
    try {
      const room = await createDocument({userId, email})
      if(room) {
        router.push(`/documents/${room.id}`)
      }
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <Button
      type="submit"
      onClick={addDocumentHandler}
      className="gradient-blue flex gap-1"
    >
      <Image src="/assets/icons/add.svg" width={24} height={24} alt="add" />
      <p className="hidden sm:block">Start a blank document</p>
    </Button>
  );
};

export default AddDocumentBtn;
