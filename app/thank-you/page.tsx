"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const params = useSearchParams();
  const petName = params.get("petName");
  const imageUrl = params.get("imageUrl");
  const amount = params.get("amount");

  useEffect(() => {
    console.log(params);
  }, []);

  return (
    <div className="bg-purple-50 w-screen h-screen">
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">
          Thank you for supporting {petName && petName[0].toUpperCase() + petName.slice(1)}!
        </h1>

        {imageUrl && (
          <Image
            src={imageUrl}
            alt={petName || "Pet"}
            width={200}
            height={200}
            className="rounded-full object-cover mb-4"
          />
        )}

        <p className="text-lg text-gray-700">
          Your gift of <span className="font-semibold">{amount && (+amount/100).toLocaleString("en-US", {style: "currency", currency: "USD"})}</span> means so
          much.
        </p>

        <Button
          onClick={() =>
            (window.location.href = `/p/${petName?.toLowerCase()}`)
          }
          className="mt-5"
        >
          Back to {petName && petName[0].toUpperCase() + petName.slice(1)}'s Circle
        </Button>
      </div>
    </div>
  );
};

export default Page;
