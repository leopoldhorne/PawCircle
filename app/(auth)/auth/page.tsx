"use client";
import { useAuth } from "@/app/context/AuthContext";
import Logo from "@/components/logo/logo";
import { supabase } from "@/server/db/supabase-client";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";



const Page = () => {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [error, setError] = useState<string>("");

  // useEffect(() => {
  //   console.log(user?.id)
  // }, [user])

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });
      if (error) {
        console.log("ERROR SIGNING IN:", error.message);
        setError("Incorrect email or password");
        throw new Error(error.message);
      }

      router.push("/c/dashboard")
      form.reset();

    },
  });

  return (
    <main className="bg-purple-50 min-h-screen">
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-center">
        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
          className={`flex flex-col bg-white w-100 h-100 rounded-lg overflow-hidden items-center p-5 shadow-xl mt-15 gap-3 ${
            user && "p-20"
          }`}
        >
          <div
            className="flex justify-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Logo />
          </div>
          {user ? (
            <div className="flex flex-col gap-5">
              <p>Sad to see you go!</p>
              <button
                onClick={() => signOut()}
                className="text-base text-white font-medium bg-purple-700 rounded-xl py-1 px-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ease-in-out duration-300 focus:outline-purple-600 border"
              >
                Sign Out
              </button>
              <a className="cursor-pointer underline hover:text-purple-600" onClick={() => router.replace("/c/dashboard")}>or back to dashboard</a>
            </div>
          ) : (
            <>
              <p className="mb-3 text-lg">Sign in to your account</p>
              <form.Field
                name="email"
                children={(field) => (
                  <div className="flex flex-col">
                    <p className="text-red-500 text-center">{error && error}</p>
                    <label htmlFor={field.name} className="text-lg">
                      Email
                    </label>
                    <input
                      id="email"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      type="text"
                      className="focus:outline-purple-600 border border-black rounded-lg px-2 h-10 text-lg"
                    />
                  </div>
                )}
              />
              <form.Field
                name="password"
                children={(field) => (
                  <div className="flex flex-col">
                    <label htmlFor={field.name} className="text-lg">
                      Password
                    </label>
                    <input
                      id="password"
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      type="password"
                      className="focus:outline-purple-600 border border-black rounded-lg px-2 h-10 text-lg"
                    />
                  </div>
                )}
              />
              <Button
                onClick={form.handleSubmit}
                className="text-lg mt-5 p-5"
              >
                Sign in
              </Button>
            </>
          )}
        </form>
      </div>
    </main>
  );
};

export default Page;
