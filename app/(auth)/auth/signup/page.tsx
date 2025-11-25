"use client";

import Logo from "@/components/logo/logo";
import { SignUp } from "@/components/SignUp";
import { SignupForm } from "@/components/signup-form";
import { Button } from "@/components/ui/button";
import {
  FieldGroup,
  FieldLabel,
  Field,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { GalleryVerticalEnd } from "lucide-react";
import React, { useState } from "react";
import z from "zod";

const ACCESS_CODE = "esther123";

const accessSchema = z.object({
  code: z.string().min(1, "Access code is required."),
});

const Page = () => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {
      code: "",
    },
    validators: {
      onSubmit: accessSchema,
    },

    onSubmit: async ({ value }) => {
      if (value.code === ACCESS_CODE) {
        setHasAccess(true);
      }
      console.log("submitted access code:", value.code);
    },
  });

  return (
    <div className="bg-purple-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 border-2 rounded-xl p-5 bg-white">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <Logo />
          PawCircle
        </a>

        {!hasAccess ? (
          <form
            className="flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <p className="text-sm text-muted-foreground text-center">
              We’re quietly onboarding a small circle of early pet parents. Use
              an access code to sign up, or join the waitlist to get in next.
            </p>
            <FieldGroup>
              <form.Field
                name="code"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor="access-code">Access Code</FieldLabel>
                      <Input
                        id="access-code"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter your code"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
            </FieldGroup>

            <Button type="submit" className="w-full">
              Continue
            </Button>
          </form>
        ) : <SignUp />}
      </div>
    </div>
  );
};

export default Page;
