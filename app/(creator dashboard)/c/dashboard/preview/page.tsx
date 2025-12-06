"use client";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

const Page = () => {
  const router = useRouter();
  const { pet, circleData, isLoadingCircleData } = useAuth();
  const imageData = [
    {
      image: circleData?.image_1_url,
      prompt: circleData?.image_1_prompt,
    },
    {
      image: circleData?.image_2_url,
      prompt: circleData?.image_2_prompt,
    },
    {
      image: circleData?.image_3_url,
      prompt: circleData?.image_3_prompt,
    },
  ];

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <Card className="w-full sm:max-w-md min-h-150 h-fit items-center font-bold px-3 justify-between">
          <div
            onClick={() => router.push("/c/dashboard")}
            className="w-full flex cursor-pointer items-center justify-between"
          >
            <p>
              <FontAwesomeIcon icon={faArrowLeft} />
            </p>
            <p>Preview Public Circle</p>
            <p></p> {/*  empty on purpose for style reasons*/}
          </div>
          {isLoadingCircleData ? (
            <p>Loading...</p>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center bg-gray-50">
                  {circleData?.profile_image_url ? (
                    <Image
                      src={circleData.profile_image_url}
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
                    {pet &&
                      pet.name[0].toUpperCase() + pet.name.slice(1)}
                    's Public Circle
                  </h1>
                  <p className="text-xs text-muted-foreground flex flex-wrap">
                    {circleData?.tagline}
                  </p>
                </div>
              </div>

              {/* Blurb */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-4 w-full min-h-10 h-fit">
                <p className="text-sm leading-relaxed text-slate-700 font-normal max-w-[90%] mx-auto">
                  {circleData?.blurb}
                </p>
              </div>

              {/* Images */}
              <p className="text-lg font-semibold text-slate-700 text-center mb-3 mt-6">
                {pet?.name[0].toUpperCase() + pet?.name.slice(1)!}'s
                Moments
              </p>
              {circleData && imageData.some((item) => item.image) && (
                <div className="px-4 py-2">
                  <div className="flex flex-col gap-6">
                    {imageData
                      .filter((item) => item.image)
                      .map((item, index) => (
                        <div
                          key={item.image ?? index}
                          className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-3"
                        >
                          {/* Prompt */}
                          {item.prompt && (
                            <p className="text-sm text-slate-700 font-medium">
                              {item.prompt}
                            </p>
                          )}
                          {/* Image */}
                          <div className="w-full aspect-square overflow-hidden rounded-xl">
                            <Image
                              src={item.image!}
                              width={800}
                              height={800}
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
                {pet &&
                  pet.name[0].toUpperCase() + pet.name.slice(1)}{" "}
                a gift
              </p>
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-4 space-y-3 text-center w-full">
                <p className="text-sm leading-relaxed text-slate-700 font-normal max-w-[90%] mx-auto">
                  {circleData?.support_blurb}
                </p>
                <div className="w-full flex gap-5 items-center justify-center">
                  <Button
                    className="cursor-pointer font-bold h-12 w-12 text-base"
                  >
                    $3
                  </Button>
                  <Button
                    className="cursor-pointer font-bold h-12 w-12 text-base"
                  >
                    $5
                  </Button>
                  <Button
                    className="cursor-pointer font-bold h-12 w-12 text-base"
                  >
                    $10
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </main>
  );
};
export default Page;
