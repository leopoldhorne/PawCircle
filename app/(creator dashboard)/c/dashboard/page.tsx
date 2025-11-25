"use client";
import { PetData, useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/server/db/supabase-client";
import { QueryClient, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// slug stuff

const slugifyName = (name: string) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces -> dashes
    .replace(/[^a-z0-9-]/g, ""); // remove anything weird
};

const generatePetSlug = async (petName: string) => {
  const baseSlug = await slugifyName(petName);
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .ilike("slug", `${baseSlug}%`);

  if (error) {
    console.error("Error checking slugs:", error.message);
    throw error;
  }

  // No matches -> we can just use the base slug
  if (!data || data.length === 0) {
    return baseSlug;
  }

  const existingSlugs = data.map((row) => row.slug as string).filter(Boolean);

  let maxSuffix = -1;

  for (const slug of existingSlugs) {
    if (slug === baseSlug) {
      // exact match = suffix 0
      if (maxSuffix < 0) maxSuffix = 0;
      continue;
    }

    if (slug.startsWith(baseSlug)) {
      const rest = slug.slice(baseSlug.length); // part after the base, e.g. "1" in "winter1"
      if (/^\d+$/.test(rest)) {
        const num = Number(rest);
        if (num > maxSuffix) {
          maxSuffix = num;
        }
      }
    }
  }

  if (maxSuffix < 0) {
    return baseSlug;
  }

  return `${baseSlug}${maxSuffix + 1}`;
};

const createCircle = async (pet: PetData) => {
  const { error } = await supabase
    .from("circles")
    .insert({ pet_id: pet.id, visibility: "public" });

  if (error) {
    console.log("CANT CREATE CIRCLE", error.message);
    throw new Error(error.message);
  }

  const slug = await generatePetSlug(pet.name);
  console.log("slug name", slug);

  const { error: updateError } = await supabase
    .from("pets")
    .update({ slug: slug })
    .eq("id", pet.id);

  if (updateError) {
    console.log("CANT UPDATE SLUG", updateError.message);
    throw new Error(updateError.message);
  }
};

const Page = () => {
  const {
    user,
    pet,
    userData,
    circleData,
    isLoadingUserData,
    isLoadingCircleData,
    signOut,
  } = useAuth();
  const queryClient = useQueryClient()
  const router = useRouter();
  const { mutate: makeCircle, isSuccess: makeCircleSuccess } = useMutation({
    mutationFn: () => createCircle(pet!!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["circleData", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["currentPet", user?.id],
      });
    },
  });
  const[isLoadingPage, setIsLoadingPage] = useState<boolean>(true)
  const[copyOpen, setCopyOpen] = useState<boolean>(false)

  const redirected = useRef(false);

  useEffect(() => {
    if (!user) return;
    if (isLoadingUserData) return;
    if (!userData && !redirected.current) {
      redirected.current = true;
      router.replace("/auth/onboarding");
    }
  }, [user, userData, router]);

  useEffect(() => {
    if (!isLoadingCircleData && !isLoadingUserData) {
      setIsLoadingPage(false)
    }
  }, [isLoadingCircleData, isLoadingUserData])

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        { isLoadingPage ? (
          <Card className="w-full sm:max-w-md h-100 items-center font-bold justify-center">
            <>
              <div className="w-[90%] bg-gray-200 rounded-lg mb-5 h-7 animate-pulse"></div>
              <Button className="w-[90%] animate-pulse"></Button>
              <Button className="w-[90%] cursor-pointer font-bold animate-pulse"></Button>
              <Button className="w-[90%] cursor-pointer font-bold animate-pulse"></Button>
              <Button className="w-[90%] cursor-pointer font-bold animate-pulse"></Button>
              <Button className="w-[90%] cursor-pointer font-bold animate-pulse"></Button>
            </>
          </Card>
        ) : (
          <Card className="w-full sm:max-w-md h-100 items-center font-bold justify-center">
            <>
              <h1 className="self-center mb-5">Parent Dashboard</h1>
              <Button
                onClick={() => {
                  if (isLoadingCircleData) return;
                  if (circleData) {
                    router.push("/c/dashboard/edit");
                  } else if (!circleData && !isLoadingCircleData) {
                    console.log("CREATE CIRCLE");
                    makeCircle();
                    if (makeCircleSuccess) {
                      router.push("/c/dashboard/edit");
                    }
                  }
                }}
                className="w-[90%] cursor-pointer font-bold"
              >
                {" "}
                {circleData && !isLoadingCircleData ? "Edit" : "Create"} Public
                Circle
              </Button>
              <Button
                onClick={() => router.push("/c/dashboard/preview")}
                className="w-[90%] cursor-pointer font-bold"
                disabled={!circleData && !isLoadingCircleData ? true : false}
              >
                Preview Public Circle 
              </Button>
              <Button className={`w-[90%] cursor-pointer font-bold ${copyOpen && "h-fit"} duration-500 ease-in-out z-10`}>
                <div className="h-full w-full">
                <p onClick={() => setCopyOpen((prev) => !prev)}>Copy Link</p>
                {
                  copyOpen && <div className="bg-white w-full border rounded-xl h-10 flex items-center justify-center mt-2 select-text cursor-auto">
                    <a href={ pet && pet.slug ? `${process.env.NEXT_PUBLIC_BASE_URL}/p/${pet.slug}` : "" }><p className="text-black">{ pet && pet.slug ? `${process.env.NEXT_PUBLIC_BASE_URL}/p/${pet.slug}` : "You must first create a public circle" }</p></a>
                  </div>
                }
              </div> 
              </Button>
              {/* <Button className="w-[90%] cursor-pointer font-bold">
                Edit Profile & Pet Info
              </Button> */}
              <Button onClick={() => router.push("/c/dashboard/earnings")} className="w-[90%] cursor-pointer font-bold">
                Earnings
              </Button>
               <Button onClick={() =>{
                signOut()
                router.replace("/")
               }} className="w-[90%] cursor-pointer font-bold">
                Sign Out
              </Button>
            </>
          </Card>
        )}
      </div>
    </main>
  );
};

export default Page;
