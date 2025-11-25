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

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <Card className="w-full sm:max-w-md h-150 items-center font-bold px-3 justify-between">
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
                <div className="h-14 w-14 rounded-full overflow-hidden">
                  <Image
                    src={circleData?.profile_image_url! && circleData?.profile_image_url}
                    alt="pet profile image"
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <h1 className="text-xl font-semibold">
                    {pet && pet.name[0].toUpperCase() + pet.name.slice(1)}'s
                    Public Circle
                  </h1>
                  <p className="text-xs text-muted-foreground flex flex-wrap">
                    {circleData?.tagline}
                  </p>
                </div>
              </div>

              {/* Blurb */}
              <div className="rounded-2xl bg-slate-50 px-4 py-3 w-full">
                <p className="text-sm leading-relaxed text-slate-700 font-normal">
                  {circleData?.blurb}
                </p>
              </div>

              {/* Images */}
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="grid grid-cols-3 gap-3">
                  {circleData &&
                    [
                      circleData.image_1_url,
                      circleData.image_2_url,
                      circleData.image_3_url,
                    ].map((src) => (
                      <div
                        key={src}
                        className="aspect-square overflow-hidden rounded-xl"
                      >
                        <Image
                          src={src! && src}
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
                <p className="text-sm font-bold">Send{pet && ` ${pet.name[0].toUpperCase() + pet.name.slice(1)}`} a gift</p>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  {circleData?.support_blurb}
                </p>
                {/* <button className="mt-2 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold bg-violet-600 text-white shadow-sm hover:bg-violet-700 transition">
                  Send a one-time gift
                </button> */}
                <div className="w-full flex gap-5 items-center justify-center">
                  <Button className="cursor-pointer font-bold h-12 w-12 text-base">
                    $3
                  </Button>
                  <Button className="cursor-pointer font-bold h-12 w-12 text-base">
                    $5
                  </Button>
                  <Button className="cursor-pointer font-bold h-12 w-12 text-base">
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
