"use client";
import { ReactFormExtendedApi, useForm } from "@tanstack/react-form";
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
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { ChevronDownIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/app/context/AuthContext";
import { supabase } from "@/server/db/supabase-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, "First Name must be at least 2 characters.")
    .regex(/[a-zA-Z]+/, "First Name can only contain letters."),
  lastName: z
    .string()
    .min(2, "Last Name must be at least 2 characters.")
    .regex(/[a-zA-Z]+/, "Last Name can only contain letters."),
  petName: z.string().regex(/[a-zA-Z]+/, "Names can only contain letters."),
  usResident: z.string().refine((val) => val === "yes", {
    message:
      "PawCircle is currently only available in the United States. We’ll be expanding soon!",
  }),
  petType: z
    .string()
    .min(1, "Please select a pet type.")
    .refine((val) => val !== "auto", {
      message:
        "Auto-detection is not allowed. Please select a specific language.",
    }),
  petTypeOther: z
    .string()
    .regex(/[a-zA-Z]+/, "Names can only contain letters.")
    .or(z.literal("")),
  petBirthday: z.string().or(z.literal("")),
});

const validateCurrentPage = async (
  form: any,
  page: number
): Promise<boolean> => {
  const pageFields: string[][] = [
    ["firstName", "lastName", "petName", "usResident"],
    ["petType", "petBirthday"],
  ];
  const errorKeys = Object.keys(form.getAllErrors().form.errors[0] || {});
  const currentPageField = pageFields[page - 1] ?? [];
  return !currentPageField.some((field) => errorKeys.includes(field));
};

const animals = [
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
  { label: "Bird", value: "bird" },
  { label: "Fish", value: "fish" },
  { label: "Rabbit", value: "rabbit" },
  { label: "Hamster", value: "hamster" },
  { label: "Guinea Pig", value: "guinea_pig" },
  { label: "Turtle", value: "turtle" },
  { label: "Ferret", value: "ferret" },
  { label: "Lizard", value: "lizard" },
  { label: "Snake", value: "snake" },
  { label: "Horse", value: "horse" },
  { label: "Other", value: "other" },
] as const;

interface UserInfo {
  firstName: string;
  lastName: string;
  petName: string;
  usResident: string,
  petType: string;
  petTypeOther?: string;
  petBirthday?: string;
}

const updateUser = async (
  value: UserInfo,
  authId: string,
  email: string
): Promise<void> => {
  const { data: user_row, error: user_error } = await supabase
    .from("users")
    .insert({
      first_name: value.firstName.trim().toLowerCase(),
      last_name: value.lastName.trim().toLowerCase(),
      email: email,
      auth_id: authId,
      country: value.usResident === "yes" && "US",
      stripe_payouts_enabled: false,
      stripe_charges_enabled: false,
    })
    .select()
    .single();
  if (user_error) {
    console.log("ERROR CREATING USER:", user_error.message);
    throw new Error(user_error.message);
  }
  const { data: pet_row, error: pet_error } = await supabase
    .from("pets")
    .insert({
      name: value.petName.trim().toLowerCase(),
      type:
        value.petType === "other"
          ? `other - ${value.petTypeOther?.trim().toLocaleLowerCase()}`
          : value.petType,
      birthday: value.petBirthday ? value.petBirthday : null,
    })
    .select()
    .single();
  if (pet_error) {
    console.log("ERROR CREATING PET:", pet_error.message);
    throw new Error(pet_error.message);
  }

  const { data: users_pets_row, error: users_pets_error } = await supabase
    .from("users_pets")
    .insert({
      user_id: user_row.id,
      pet_id: pet_row.id,
      role: "owner",
      updated_at: new Date(Date.now()).toISOString(),
    });
  if (users_pets_error) {
    console.log("ERROR CREATING USERSPETS", users_pets_error.message);
    throw new Error(users_pets_error.message);
  }
  console.log("updated");
};

export function Page() {
  const [page, setPage] = useState<number>(1);
  const [petName, setPetName] = useState<string>("");
  const [isOther, setIsOther] = useState<boolean>(false);
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const queryClient = useQueryClient();
  const { mutate, isSuccess, isError } = useMutation({
    mutationFn: (value: UserInfo) => updateUser(value, user!.id, user!.email!),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userData", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["currentPet", user?.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["circleData", user?.id],
      });
    },
  });
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (isSuccess && !redirected.current) {
      setTimeout(() => {
        router.replace("/c/dashboard");
      }, 500);
    }
  }, [isSuccess]);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      petName: "",
      usResident: "",
      petType: "",
      petTypeOther: "",
      petBirthday: "",
    },
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      mutate(value);
      if (isSuccess) {
        toast("Success!", {
          description: "Welcome to the village",
          position: "top-center",
          classNames: {
            content: "flex flex-col gap-2",
          },
          style: {
            "--border-radius": "calc(var(--radius)  + 4px)",
          } as React.CSSProperties,
        });
      }
    },
  });

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <Toaster />
        <Card className="w-full sm:max-w-md">
          <CardHeader>
            <CardTitle>Welcome to PawCricle</CardTitle>
            <CardDescription>
              We just need a little more information before you get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="first-3-questions"
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col gap-3"
            >
              <FieldGroup className={`${page !== 1 && "hidden"}`}>
                <form.Field
                  name="firstName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="form-tanstack-input-firstName">
                          First Name
                        </FieldLabel>
                        <Input
                          id="form-tanstack-input-firstName"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="John"
                          autoComplete="first"
                        />
                        {/* <FieldDescription>
                          This is your public display name. Must be between 3
                          and 10 characters. Must only contain letters, numbers,
                          and underscores.
                        </FieldDescription> */}
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <FieldGroup className={`${page !== 1 && "hidden"}`}>
                <form.Field
                  name="lastName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="form-tanstack-input-lastName">
                          Last Name
                        </FieldLabel>
                        <Input
                          id="form-tanstack-input-lastName"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Doe"
                          autoComplete="last"
                        />
                        {/* <FieldDescription>
                          This is your public display name. Must be between 3
                          and 10 characters. Must only contain letters, numbers,
                          and underscores.
                        </FieldDescription> */}
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <FieldGroup className={`${page !== 1 && "hidden"}`}>
                <form.Field
                  name="petName"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor="form-tanstack-input-petName">
                          What is your pet's name?
                        </FieldLabel>
                        <Input
                          id="form-tanstack-input-petName"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Fluffy"
                        />
                        {/* <FieldDescription>
                          This is your public display name. Must be between 3
                          and 10 characters. Must only contain letters, numbers,
                          and underscores.
                        </FieldDescription> */}
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <FieldGroup className={`${page !== 1 && "hidden"}`}>
                <form.Field
                  name="usResident"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field orientation="responsive" data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor="form-tanstack-select-usResident">
                            Do you live in the US?
                          </FieldLabel>
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) => field.handleChange(e)}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-usResident"
                            aria-invalid={isInvalid}
                            className="w-[180px]"
                          >
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>

                          <SelectContent position="item-aligned">
                            {/* <SelectItem value="" disabled>Pet Types</SelectItem> */}
                            <SelectSeparator />
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                        {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              <FieldGroup className={`${page !== 2 && "hidden"}`}>
                <form.Field
                  name="petType"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field orientation="responsive" data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor="form-tanstack-select-petType">
                            What type of pet is{" "}
                            {petName &&
                              petName[0].toUpperCase() + petName.slice(1)}
                          </FieldLabel>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(e) => {
                            field.handleChange(e), console.log(e);
                            if (field.state.value === "other") {
                              setIsOther(true);
                            } else {
                              setIsOther(false);
                            }
                          }}
                        >
                          <SelectTrigger
                            id="form-tanstack-select-petType"
                            aria-invalid={isInvalid}
                            className="w-[180px]"
                          >
                            <SelectValue placeholder="Select a pet type" />
                          </SelectTrigger>

                          <SelectContent position="item-aligned">
                            {/* <SelectItem value="" disabled>Pet Types</SelectItem> */}
                            <SelectSeparator />
                            {animals.map((animal) => (
                              <SelectItem
                                key={animal.value}
                                value={animal.value}
                              >
                                {animal.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
              {isOther && (
                <FieldGroup className={`${page !== 2 && "hidden"}`}>
                  <form.Field
                    name="petTypeOther"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor="form-tanstack-input-petTypeOther">
                            Please write what type
                          </FieldLabel>
                          <Input
                            id="form-tanstack-input-petTypeOther"
                            name={field.name}
                            value={isOther ? field.state.value : ""}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(isOther ? e.target.value : "")
                            }
                            aria-invalid={isInvalid}
                            placeholder="Dragon"
                          />
                          {/* <FieldDescription>
                          This is your public display name. Must be between 3
                          and 10 characters. Must only contain letters, numbers,
                          and underscores.
                        </FieldDescription> */}
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              )}
              <FieldGroup className={`${page !== 2 && "hidden"}`}>
                <form.Field
                  name="petBirthday"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field orientation="responsive" data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor="form-tanstack-select-petBirthday">
                            When is{" "}
                            {petName &&
                              petName[0].toUpperCase() + petName.slice(1)}
                            's birthday?
                          </FieldLabel>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </FieldContent>
                        <Popover open={open} onOpenChange={setOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              id="date"
                              className="w-48 justify-between font-normal"
                            >
                              {date ? date.toLocaleDateString() : "Select date"}
                              <ChevronDownIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-auto overflow-hidden p-0"
                            align="start"
                          >
                            <Calendar
                              mode="single"
                              selected={date}
                              captionLayout="dropdown"
                              onSelect={(date) => {
                                setDate(date);
                                setOpen(false);
                                date &&
                                  field.handleChange(date.toLocaleDateString());
                                console.log(field.state.value);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                      </Field>
                    );
                  }}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal" className="flex justify-around">
              <Button
                disabled={page === 1 ? true : false}
                onClick={() => setPage((prev) => (prev > 1 ? (prev -= 1) : 1))}
              >
                Back
              </Button>
              <Button
                onClick={async (event) => {
                  if (page === 1) {
                    setPetName(form.getFieldValue("petName").toLowerCase());
                  }
                  const ok = await validateCurrentPage(form, page);
                  if (ok) setPage((prev) => (prev += 1));
                }}
                className={`${page === 2 && "hidden"}`}
              >
                Next
              </Button>
              <Button
                type="submit"
                form="first-3-questions"
                className={`${page !== 2 && "hidden"}`}
              >
                Submit
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}

export default Page;
