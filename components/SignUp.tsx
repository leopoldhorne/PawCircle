"use client";

import * as React from "react";
import * as z from "zod";
import { useForm } from "@tanstack/react-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/server/db/supabase-client";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
    confirmPassword: z.string().min(8, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match.",
  });

type SignupValues = z.infer<typeof signupSchema>;

const signUpFn = async (values: {
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
  });

  if (error) {
    throw new Error("Sign Up Error");
  }

  if (data) {
    return true;
  }

  return false;
};

export function SignUp({ className, ...props }: React.ComponentProps<"form">) {
  const [spinner, setSpinner] = React.useState<boolean>(false);
  const [yes, setYes] = React.useState<boolean>(false);
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: (values: {
      email: string;
      password: string;
      confirmPassword: string;
    }) => signUpFn(values),
    onSuccess: () => {
      setYes(true);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChangeAsyncDebounceMs: 400,
      onChangeAsync: signupSchema,
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      setSpinner(true);
      mutate(value);
      // console.log("signup submit", value);
    },
  });

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      {...props}
    >
      {!yes ? (
        <div className="mt-4 border border-purple-600 bg-purple-50 text-black text-sm text-center p-3 rounded">
          📩 <strong>Check your inbox!</strong>
          <br />A confirmation email has been sent by{" "}
          <strong>PawCircle</strong>
          <br />
          <span className="font-mono text-xs">
            &lt;pawcircleteam@gmail.com&gt;
          </span>
          <br />
          <br />
          Check your regular mail folder and <b>SPAM FOLDER</b>
          <br />
          <br />
          You must click the link in that email to verify your account <br />
          before you can sign in.
          <br />
          <br />
          Once confirmed, return to the landing page and use the menu <br />
          to navigate to <strong>Sign In</strong>.
          <br/>
        </div>
      ) : (
        <>
          <FieldGroup>
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold mt-2">Create your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Fill in the form below to create your account
              </p>
            </div>
            {/* Email */}

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                      id="signup-email"
                      type="email"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="me@example.com"
                      autoComplete="email"
                    />
                    <FieldDescription>
                      We&apos;ll use this to contact you. We will not share your
                      email with anyone else.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Password */}
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <Input
                      id="signup-password"
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                    />
                    <FieldDescription>
                      Must be at least 8 characters long.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Confirm Password */}
            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="signup-confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="signup-confirmPassword"
                      type="password"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                    />
                    <FieldDescription>
                      Please confirm your password.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Primary submit */}
            <Field>
              <Button
                type="submit"
                className="w-full"
                disabled={form.state.isSubmitting}
              >
                {spinner ? <Spinner /> : "Create Account"}
              </Button>
            </Field>
            <Field className="flex flex-col gap-2">
              <FieldDescription className="px-6 text-center">
                Already have an account?{" "}
                <a href="/auth" className="underline">
                  Sign in
                </a>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </>
      )}
    </form>
  );
}
