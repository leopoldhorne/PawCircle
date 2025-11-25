"use client";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const SuccessPopup = ({ success }: { success: boolean }) => {
  return (
    <div
      className={`mt-3 fixed flex justify-between bg-green-50 p-2 h-27 w-54 top-0 left-[50%] -translate-x-[50%] border-2 border-green-500 ${
        success ? `visible translate-y-[0%]` : `invisible -translate-y-[300%]`
      } ease-in-out duration-700 rounded-xl`}
    >
      <div className="flex h-full items-center overflow-hidden w-[35%]">
        <FontAwesomeIcon icon={faCheck} className="text-green-500 text-6xl" />
      </div>
      <div className="flex flex-col justify-center w-[65%]">
        <p className="font-bold text-base text-center">You're in</p>
        <p className="text-center">Watch your inbox for early access</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
