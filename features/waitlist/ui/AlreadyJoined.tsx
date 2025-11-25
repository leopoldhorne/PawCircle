"use client";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const AlreadyJoined = ({ alreadyJoined }: { alreadyJoined: boolean }) => {
  return (
    <div
      className={`mt-3 fixed flex justify-between bg-red-50 p-2 h-27 w-54 top-0 left-[50%] -translate-x-[50%] border-2 border-red-500 ${
        alreadyJoined
          ? `visible translate-y-[0%]`
          : `invisible -translate-y-[300%]`
      } ease-in-out duration-700 rounded-xl`}
    >
      <div className="flex h-full items-center overflow-hidden w-[35%]">
        <FontAwesomeIcon icon={faX} className="text-red-500 text-6xl" />
      </div>
      <div className="flex flex-col justify-center w-[65%]">
        <p className="font-bold text-base text-center">Double dipping?</p>
        <p className="text-center">You're already on the list</p>
      </div>
    </div>
  );
};

export default AlreadyJoined;
