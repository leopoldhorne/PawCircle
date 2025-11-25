"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function ThankYouInner() {
  const params = useSearchParams();
  const petName = params.get("petName");
  const imageUrl = params.get("imageUrl");
  const amount = params.get("amount");

  const capitalizedPetName =
    petName && petName.length > 0
      ? petName[0].toUpperCase() + petName.slice(1)
      : "";

  const formattedAmount =
    amount != null
      ? (Number(amount) / 100).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })
      : null;

  return (
    <div className="bg-purple-50 w-screen h-screen">
      <div className="p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Thank you for supporting{" "}
          {capitalizedPetName || "your fur baby"}!
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

        <p className="text-lg text-gray-700 text-center">
          Your gift of{" "}
          {formattedAmount && (
            <span className="font-semibold">{formattedAmount}</span>
          )}{" "}
          means so much.
        </p>

        {petName && (
          <Button
            onClick={() =>
              (window.location.href = `/p/${petName.toLowerCase()}`)
            }
            className="mt-5"
          >
            Back to {capitalizedPetName}'s Circle
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ThankYouInner />
    </Suspense>
  );
}