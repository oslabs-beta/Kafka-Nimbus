"use client";
import * as React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function CreateClusterCard() {
  const router = useRouter();


  const createClusterHandler = () => {
    router.push("/create-cluster");
  };

  return (
    <div
      onClick={createClusterHandler}
      className="card bg-base-100 h-48 w-72 overflow-hidden rounded-xl shadow-xl hover:ring-4 cursor-pointer"
    >
      <div className="flex h-48 w-full items-center justify-center ">
        <div className="flex flex-col items-center justify-center gap-2">
          <PlusIcon className="h-8 w-8" />
          <p>Create a new cluster</p>
        </div>
      </div>
    </div>
  );
}
