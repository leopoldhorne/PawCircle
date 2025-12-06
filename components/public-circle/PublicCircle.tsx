"use client";
import { Card } from "@/components/ui/card";
import { CircleData, PetData, useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/server/db/supabase-client";
import SkeletonCircle from "@/components/public-circle/SkeletonCircle";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { ParamValue } from "next/dist/server/request/params";

interface CircleAndPet {
  circleInfo: any;
  petInfo: any;
  userId: any;
}

const fetchCircle = async (slug: string): Promise<CircleAndPet | null> => {
  const { data, error } = await supabase
    .from("pets")
    .select("*, circles(*), users_pets(user_id)")
    .eq("slug", slug);

  if (error) {
    throw new Error("UNABLE TO FIND PAGGE");
  }

  if (!data) {
    return null;
  }

  const petInfo = Object.fromEntries(
    Object.entries(data[0]).filter(
      ([key, value]) => typeof value === "string" || typeof value === "number"
    )
  ); // idk tbh but it works to filter object into just pet

  const circleInfo = data![0].circles[0];

  const userId = data[0].users_pets[0].user_id;

  const info = { circleInfo: circleInfo, petInfo: petInfo, userId: userId };

  return info;
};

interface SubscribeResponse {
  url: string;
}

interface SubScribeError {
  error: string;
}

const checkoutGift = async (
  amount_in_cents: number,
  petId: number,
  petSlug: string,
  petName: string,
  userId: number,
  petImageUrl: string
): Promise<SubscribeResponse> => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount_in_cents,
      petId,
      petSlug,
      petName,
      userId,
      petImageUrl,
    }),
  });

  // console.log(petId)
  // console.log(
  //   JSON.stringify({
  //     amount_in_cents,
  //     petId,
  //     petSlug,
  //     petName,
  //     userId,
  //     petImageUrl,
  //   })
  // );

  if (!response.ok) {
    const errorData: SubScribeError = await response.json();
    throw new Error(errorData.error || "Something went wrong.");
  }

  const data: SubscribeResponse = await response.json();
  return data;
};

const PublicCircle = ({slug}: {slug: string}) => {
  const [imagesReady, setImagesReady] = useState(false);
  const { data, error, isLoading } = useQuery<CircleAndPet | null, Error>({
    queryKey: ["data", slug],
    queryFn: () => fetchCircle(slug as string),
    enabled: !!slug,
  });
  
  const circleInfo = data?.circleInfo;
  const petInfo = data?.petInfo;
  const userId = data?.userId;

  const { mutate, isPending } = useMutation({
    mutationFn: (amount_in_cents: number) => {
      return checkoutGift(
        amount_in_cents,
        petInfo?.id,
        petInfo?.slug,
        petInfo?.name,
        userId,
        circleInfo?.profile_image_url
      );
    },
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleGift = (amount_in_cents: number) => {
    mutate(amount_in_cents);
  };

  useEffect(() => {
    if (!circleInfo) return;

    const urls = [
      circleInfo.image_1_url,
      circleInfo.image_2_url,
      circleInfo.image_3_url,
    ].filter(Boolean) as string[];

    if (urls.length === 0) return;

    let loadedCount = 0;
    const imgElements: HTMLImageElement[] = [];

    urls.forEach((url) => {
      const img = new window.Image();
      img.src = url;

      const handleDone = () => {
        loadedCount += 1;
        if (loadedCount === urls.length) {
          setImagesReady(true);
        }
      };

      img.onload = handleDone;
      img.onerror = handleDone;

      imgElements.push(img);
    });

    return () => {
      imgElements.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [circleInfo]);

  const imageData = circleInfo
    ? [
        { image: circleInfo.image_1_url, prompt: circleInfo.image_1_prompt },
        { image: circleInfo.image_2_url, prompt: circleInfo.image_2_prompt },
        { image: circleInfo.image_3_url, prompt: circleInfo.image_3_prompt },
      ].filter((item) => !!item.image)
    : [];

  return (
    <main className="w-full min-h-screen h-fit bg-purple-50">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <Card className="w-full sm:max-w-md min-h-150 h-fit items-center font-bold px-3 justify-between">
          {isLoading ? (
            <SkeletonCircle />
          ) : circleInfo && petInfo ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
                  {circleInfo?.profile_image_url ? (
                    <Image
                      src={circleInfo.profile_image_url}
                      alt="pet"
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">🐾</span>
                  )}
                </div>

                <div>
                  <h1 className="text-xl font-semibold">
                    {petInfo &&
                      petInfo.name[0].toUpperCase() + petInfo.name.slice(1)}
                    's Public Circle
                  </h1>
                  <p className="text-xs text-muted-foreground flex flex-wrap">
                    {circleInfo?.tagline}
                  </p>
                </div>
              </div>

              {/* Blurb */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-4 w-full min-h-10 h-fit">
                <p className="text-sm leading-relaxed text-slate-700 font-normal max-w-[90%] mx-auto">
                  {circleInfo?.blurb}
                </p>
              </div>

              {/* Images */}
              <p className="text-lg font-semibold text-slate-700 text-center mb-3 mt-6">
                {petInfo.name[0].toUpperCase() + petInfo.name.slice(1)}'s
                Moments
              </p>
              {data && imagesReady && imageData.length > 0 && (
                <div className="px-4 py-2">
                  <div className="flex flex-col gap-6">
                    {imageData.map((item, index) => (
                      <div
                        key={item.image ?? index}
                        className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3"
                      >
                        {/* Prompt */}
                        {item.prompt && (
                          <p className="text-sm text-slate-700 font-normal max-w-[90%] mx-auto">
                            {item.prompt}
                          </p>
                        )}

                        {/* Image */}
                        <div className="w-full aspect-square overflow-hidden rounded-xl bg-slate-100">
                          <img
                            src={item.image as string}
                            alt="Pet photo"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support */}
              <p className="text-lg font-semibold text-slate-700 text-center mb-3 mt-6">
                Send{" "}
                {petInfo &&
                  petInfo.name[0].toUpperCase() + petInfo.name.slice(1)}{" "}
                a gift
              </p>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-4 space-y-3 text-center w-full">
                <p className="text-sm leading-relaxed text-slate-700 font-normal max-w-[90%] mx-auto">
                  {circleInfo?.support_blurb}
                </p>
                <div className="w-full flex gap-5 items-center justify-center">
                  <Button
                    onClick={() => handleGift(300)}
                    className="cursor-pointer font-bold h-12 w-12 text-base"
                  >
                    $3
                  </Button>
                  <Button
                    onClick={() => handleGift(500)}
                    className="cursor-pointer font-bold h-12 w-12 text-base"
                  >
                    $5
                  </Button>
                  <Button
                    onClick={() => handleGift(1000)}
                    className="cursor-pointer font-bold h-12 w-12 text-base"
                  >
                    $10
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-red-500 font-bold text-center">
                USER NOT FOUND:
                <br />
                Please try again
              </div>
            </>
          )}
        </Card>
      </div>
    </main>
  );
};
export default PublicCircle;
