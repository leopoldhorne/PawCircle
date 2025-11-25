"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { toast, Toaster } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { PetData, useAuth } from "@/app/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/server/db/supabase-client";
import { is } from "date-fns/locale";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "Please upload a file." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: `File size should be less than ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB.`,
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPEG, PNG, or WebP images are allowed.",
    })
    .optional(),
});

const updateImage = async (num: number, file: File, pet: PetData) => {
  let update = {}
  const filePath = `${pet.name}-${pet.id}-${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("public-circle-bucket")
    .upload(filePath, file);

  if (uploadError) {
    console.log("IMAGE UPLOAD ERROR:", uploadError.message);
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("public-circle-bucket")
    .getPublicUrl(filePath);

  if (num === 1) {
    update = {profile_image_url: publicUrlData.publicUrl}
  } else if (num === 5) {
    update = {image_1_url: publicUrlData.publicUrl}
  } else if (num === 6) {
    update = {image_2_url: publicUrlData.publicUrl}
  } else if (num === 7) {
    update = {image_3_url: publicUrlData.publicUrl}
  }


  const { error } = await supabase
    .from("circles")
    .update(update)
    .eq("pet_id", pet.id)
    .eq("visibility", "public");

  if (error) {
    console.log("UPDATE ERROR:", error.message);
    throw new Error(error.message);
  }
};

interface Props {
  openEdit: number;
  setOpenEdit: Dispatch<SetStateAction<number>>;
}

const EditImagesForm = ({ openEdit, setOpenEdit }: Props) => {
  const selectedOpenEdits = [1, 5, 6, 7];
  const { pet, user, circleData, isLoadingCircleData } = useAuth();
  const queryClient = useQueryClient();
  const [uploadedFile, setUploadedFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null >(null);
  const [isOldImage, setIsOldImage] = useState<boolean>(true)

  const handleFileChange = (file: File | undefined) => {
    if (!file) return;
    setUploadedFile(file);
    setIsOldImage(false)
  };
  useEffect(() => {
    if (!uploadedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(uploadedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url); // prevent memory leak
    };
  }, [uploadedFile]);
  useEffect(() => {
    // hacky solution but i am down bad still
    if (circleData && !isLoadingCircleData) {
      if (!circleData?.profile_image_url && openEdit === 1) {
        setIsOldImage(false)
      }
      if (!circleData?.image_1_url && openEdit === 5) {
        setIsOldImage(false)
      }
      if (!circleData?.image_2_url && openEdit === 6) {
        setIsOldImage(false)
      }
      if (!circleData?.image_3_url && openEdit === 7) {
        setIsOldImage(false)
      }
    }
  }, [circleData, isLoadingCircleData, openEdit])

  const { mutate, isSuccess } = useMutation({
    mutationFn: (file: File) => updateImage(openEdit, file, pet!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["circleData", user?.id],
      });
      setOpenEdit(0);
      setPreviewUrl(null);
      setUploadedFile(undefined)
      setIsOldImage(true)
    },
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<
    FormValues,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >({
    // dear future me. i'm fucking down bad okay. i made all the other 12 types any so it wouldn't error any more. fix this in the future please.
    defaultValues: {
      file: undefined,
    },
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: formSchema,
    },
    onSubmit: async ({ value }) => {
      uploadedFile && mutate(uploadedFile);
      form.reset();
    },
  });

  return (
    <div
      className={`fixed w-screen h-screen bg-black/80 z-10 flex items-start justify-center ${
        !selectedOpenEdits.some((e) => e === openEdit) && "hidden"
      }`}
    >
      <Toaster />
      <Card className="w-full sm:max-w-md mt-9">
        <CardHeader>
          <div className="flex justify-between w-full">
            <CardTitle>Update Circle</CardTitle>
            <FontAwesomeIcon
              onClick={() => setOpenEdit(0)}
              icon={faX}
              className="cursor-pointer"
            />
          </div>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-5"
            id="form-tanstack-input-2"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="file"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel
                        htmlFor="file-upload"
                        className="flex justify-center"
                      >
                        <label
                          htmlFor="file-upload"
                          className="relative w-40 h-40 rounded-xl border border-gray-300 overflow-hidden cursor-pointer bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                        >
                          {
                          circleData && isOldImage ? <img
                              src={!isLoadingCircleData && openEdit === 1 ? circleData?.profile_image_url! : openEdit === 5 ? circleData?.image_1_url! : openEdit === 6 ? circleData?.image_2_url! : openEdit === 7 ? circleData?.image_3_url! : undefined}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            /> :
                          previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm text-gray-600">
                              Upload Image
                            </span>
                          )}
                        </label>
                      </FieldLabel>
                      <Input
                        id="file-upload"
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? undefined;
                          field.handleChange(file);
                          handleFileChange(file);
                        }}
                        aria-invalid={isInvalid}
                        type="file"
                        className="hidden"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="submit" form="form-tanstack-input-2">
              Save
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditImagesForm;
