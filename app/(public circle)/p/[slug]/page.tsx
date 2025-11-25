"use client";
import { Card } from "@/components/ui/card";
import { CircleData, PetData, useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/server/db/supabase-client";
import SkeletonCircle from "@/components/public-circle/SkeletonCircle";
import { Button } from "@/components/ui/button";

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
    Object.entries(data[0]).filter(([key, value]) => typeof value === "string" || "number")
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

const Page = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { pet, circleData, isLoadingCircleData } = useAuth();

  const { data, error, isLoading } = useQuery<CircleAndPet | null, Error>({
    queryKey: ["data", slug],
    queryFn: () => fetchCircle(slug as string),
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

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <Card className="w-full sm:max-w-md h-150 items-center font-bold px-3 justify-between">
          {isLoading ? (
            <SkeletonCircle />
          ) : circleInfo && petInfo ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="h-14 w-14 rounded-full overflow-hidden">
                  <Image
                    src={
                      circleInfo?.profile_image_url &&
                      circleInfo?.profile_image_url
                    }
                    alt="pet"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
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
              <div className="rounded-2xl bg-slate-50 px-4 py-3 w-full">
                <p className="text-sm leading-relaxed text-slate-700 font-normal">
                  {circleInfo?.blurb}
                </p>
              </div>

              {/* Images */}
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="grid grid-cols-3 gap-3">
                  {data &&
                    [
                      circleInfo.image_1_url,
                      circleInfo.image_2_url,
                      circleInfo.image_3_url,
                    ].map((src) => (
                      <div
                        key={src}
                        className="aspect-square overflow-hidden rounded-xl"
                      >
                        <Image
                          src={src && src}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover"
                          alt="hero images"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Support */}
              <div className="rounded-2xl bg-slate-50 px-4 py-4 space-y-3 text-center w-full">
                <p className="text-sm font-bold">
                  Send
                  {petInfo &&
                    ` ${
                      petInfo.name[0].toUpperCase() + petInfo.name.slice(1)
                    }`}{" "}
                  a gift
                </p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {circleData?.support_blurb}
                </p>
                {/* <button className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-violet-600 text-white shadow-sm hover:bg-violet-700 transition">
                  Send a one-time gift
                </button> */}
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
export default Page;
