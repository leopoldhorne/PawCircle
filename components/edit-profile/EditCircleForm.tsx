"use client";
import React, { Dispatch, SetStateAction } from "react";
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

const updateField = async (num: number, values: valuesArg, petId: string) => {
  let update = {};
  console.log(num);
  if (num === 2) {
    update = { tagline: values.tagline };
  }
  if (num === 3) {
    update = { blurb: values.blurb };
  }
  if (num === 4) {
    update = { support_blurb: values.supportBlurb };
  }
  console.log(update);
  const { error } = await supabase
    .from("circles")
    .update(update)
    .eq("pet_id", petId)
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

const EditCircleForm = ({ openEdit, setOpenEdit }: Props) => {
  const selectedOpenEdits = [2, 3, 4]
  const { pet, user, circleData } = useAuth();
  const queryClient = useQueryClient();
  const { mutate, isSuccess } = useMutation({
    mutationFn: (values: valuesArg) => updateField(openEdit, values, pet!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["circleData", user?.id],
      });
      setOpenEdit(0);
    },
  });
  const form = useForm({
    defaultValues: {
      tagline: circleData?.tagline as string || "",
      blurb: circleData?.blurb as string || "",
      supportBlurb: circleData?.support_blurb as string || "",
    },
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      mutate(value);
      form.reset();
    },
  });

  return (
    <div
      className={`fixed inset-0 w-screen h-screen bg-black/80 z-10 flex items-start justify-center ${
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
            id="form-tanstack-input"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className={`${openEdit !== 2 && "hidden"}`}>
              <form.Field
                name="tagline"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="form-tanstack-input-tagline">
                        Tagline
                      </FieldLabel>
                      <Input
                        id="form-tanstack-input-tagline"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter your Tagline"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <FieldGroup className={`${openEdit !== 3 && "hidden"}`}>
              <form.Field
                name="blurb"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="form-tanstack-input-blurb">
                        Blurb
                      </FieldLabel>
                      <Input
                        id="form-tanstack-input-blurb"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={`Tell us more about ${
                          pet
                            ? pet.name[0].toUpperCase() + pet.name.slice(1)
                            : `your fur baby`
                        }`}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
            <FieldGroup className={`${openEdit !== 4 && "hidden"}`}>
              <form.Field
                name="supportBlurb"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="form-tanstack-input-supportBlurb">
                        Support Blurb
                      </FieldLabel>
                      <Input
                        id="form-tanstack-input-supportBlurb"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Tell your village where the gifts are going"
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
            <Button type="submit" form="form-tanstack-input">
              Save
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EditCircleForm;
