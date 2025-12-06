"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/server/db/supabase-client";
import { is } from "date-fns/locale";
const formSchema = z.object({
  tagline: z
    .string()
    .max(40, "Tagline can be at most 40 characters.")
    .or(z.literal("")),
  blurb: z
    .string()
    .max(200, "Blurb can be at most 200 characters.")
    .or(z.literal("")),
  supportBlurb: z
    .string()
    .max(200, "Support Blurb can be at most 200 characters.")
    .or(z.literal("")),
});
interface valuesArg {
  tagline: string;
  blurb: string;
  supportBlurb: string;
}

const updatePrompt = async (selectedPrompt: string, openPrompt: number, petId: string ) => {
  if (!petId) {
    throw new Error("CANT UPDATE PROMPT: NO PET ID")
  }

  if (!selectedPrompt || !openPrompt) {
    throw new Error("CANT UPDATE PROMPT: NOT ENOUGH INFO")
  }

  let update = {};

  console.log(openPrompt);
  if (openPrompt === 1) {
    update = { image_1_prompt: selectedPrompt };
  }
  if (openPrompt === 2) {
    update = { image_2_prompt: selectedPrompt };
  }
  if (openPrompt === 3) {
    update = { image_3_prompt: selectedPrompt };
  }
  console.log(update);

  const {error} = await supabase.from("circles").update(update).eq("pet_id", petId).eq("visibility", "public") 

  if (error) {
    throw new Error("CANT UPDATE PROMPT: NOT ABLE TO UPDATE DB")
  }


}

interface Props {
  openPrompt: number;
  setOpenPrompt: Dispatch<SetStateAction<number>>;
}

const EditPrompt = ({ openPrompt, setOpenPrompt }: Props) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const { pet, user, circleData } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isSuccess } = useMutation({
    mutationFn: () => updatePrompt(selectedPrompt, openPrompt, pet!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["circleData", user?.id],
      });
      setOpenPrompt(0);
    },
  });

  const handleSave = () => {
    if (!selectedPrompt) return
    mutate()
  }

  
  const petPrompts = pet ? [
    `Cozy ${pet?.name[0].toUpperCase() + pet?.name.slice(1)} under a blanket`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} in a funny hat`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} wrapped in a towel`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} wearing a tiny crown`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} in sunglasses`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} curled up sleeping`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} in a holiday outfit`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} looking out the window`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} playing with their favorite toy`,
    `${pet?.name![0].toUpperCase() + pet?.name.slice(1)} warming up after a snowy adventure`,
  ] : [`Loading...`];

  return (
    <div
      className={`fixed inset-0 w-screen h-screen bg-black/80 z-10 flex items-start justify-center ${openPrompt === 0 && "hidden"}`}
    >
      <Toaster />
      <Card className="w-full sm:max-w-md max-h-[90vh] mt-9 flex flex-col">
        <CardHeader>
          <div className="flex justify-between w-full">
            <CardTitle>Select a prompt</CardTitle>
            <FontAwesomeIcon
              onClick={() => setOpenPrompt(0)}
              icon={faX}
              className="cursor-pointer"
            />
          </div>
        </CardHeader>
        <CardContent className="w-full flex-1 overflow-y-auto!">
          <div className="flex flex-wrap w-full gap-3 justify-center">
            {petPrompts.map((prompt, index) => (
              <div
                key={index}
                onClick={() => setSelectedPrompt(prompt)}
                className={`w-[48%] h-32 border rounded-xl p-4 text-base cursor-pointer flex items-center justify-center text-center leading-snug transition-all duration-150
      ${
        selectedPrompt === prompt
          ? "border-purple-500 bg-purple-50"
          : "border-gray-300"
      }`}
              >
                {prompt}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={() => handleSave()}className="cursor-pointer">
              Save
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditPrompt;
