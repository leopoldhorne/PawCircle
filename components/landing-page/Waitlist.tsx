"use client";

import { faArrowRight, faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateTag } from "next/cache";
import React, { useEffect, useState } from "react";
import { checkEmail, updateValues } from "@/features/waitlist/server-waitlist/actions";
import AlreadyJoined from "../../features/waitlist/ui/AlreadyJoined";
import SuccessPopup from "../../features/waitlist/ui/SuccessPopup";
import ErrorPopup from "../../features/waitlist/ui/ErrorPopup";
import { Button } from "../ui/button";

const Waitlist = () => {
  const [petName, setPetName] = useState<string>("");
  const [debouncedPetName, setDebouncedPetName] = useState<string>("");
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [alreadyJoined, setAlreadyJoined] = useState<boolean>(false);
  const [errorNotif, setErrorNotif] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!success) return;
    setTimeout(() => {
      setSuccess(false);
    }, 2000);
  }, [success]);

  useEffect(() => {
    if (!alreadyJoined) return;
    setTimeout(() => {
      setAlreadyJoined(false);
    }, 2000);
  }, [alreadyJoined]);

  useEffect(() => {
    if (!errorNotif) return;
    setTimeout(() => {
      setErrorNotif(false);
    }, 2000);
  }, [errorNotif]);

  useEffect(() => {
    setTimeout(() => {
      setDebouncedPetName(petName);
    }, 1000);
  }, [petName]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitDisabled) {
      setAlreadyJoined(true)
      return
    };
    try {
      setIsLoading(true)
      const formData = new FormData(event.currentTarget);
      const form = {
        firstName: formData.get("firstName")?.toString(),
        lastName: formData.get("lastName")?.toString(),
        email: formData.get("email")?.toString(),
        petName: formData.get("petName")?.toString(),
        petType: formData.get("petType")?.toString(),
        socials: formData.get("socials")?.toString(),
        audienceSize: formData.get("audienceSize")?.toString(),
        message: formData.get("message")?.toString(),
      };
      console.log(form);

      const exists = await checkEmail(form.email);

      if (exists) {
        setAlreadyJoined(true);
        console.log("ALREADY SIGNED UP");
        setIsLoading(false)
        return;
      }
      await updateValues(form);
      setSuccess(true);
      setSubmitDisabled(true);
      setIsLoading(false)
    } catch (error) {
      setErrorNotif(true);
      setIsLoading(false)
    }
  }

  return (
    <>
      <ErrorPopup errorNotif={errorNotif} />
      <AlreadyJoined alreadyJoined={alreadyJoined} />
      <SuccessPopup success={success} />
      <section id="waitlist" className="bg-white h-fit">
        <div className="wrapper max-w-6xl mx-auto px-5 py-10 flex flex-col justify-center items-center gap-5 h-full text-center">
          <h4 className="title text-4xl font-bold max-md:text-2xl">
            Early access is limited. Join the creator waitlist.
          </h4>
          <p className="para text-lg md:w-[75%] max-md:text-base">
            We release new invites each week for creators who want to set up a page for their pet.
          </p>
          <form
            action=""
            className="flex flex-col items-start gap-2 max-sm:w-[90%] md:w-[70%] bg-white p-5 rounded-xl shadow-xl border"
            onSubmit={(event) => handleSubmit(event)}
          >
            <div className="firstName flex flex-col gap-2 items-start w-full">
              <label htmlFor="firstName" className="">
                First Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="border rounded-xl px-2 w-full"
                required
              />
            </div>
            <div className="lastName flex flex-col gap-2 items-start w-full">
              <label htmlFor="lastName">
                Last Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="border rounded-xl px-2 w-full"
                required
              />
            </div>
            <div className="email flex flex-col gap-2 items-start w-full">
              <label htmlFor="email">
                Email<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="border rounded-xl px-2 w-full"
                title="We'll only send helpful updates about PawCircle."
                required
              />
            </div>
            <div className="petName flex gap-2 flex-col items-start w-full">
              <label htmlFor="petName">
                Pet Name<span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="petName"
                name="petName"
                className="border rounded-xl px-2 w-full"
                required
                onChange={(event) => setPetName(event.target.value.toString())}
              />
            </div>
            <div className="petType flex flex-col items-start w-full">
              <p className="title">
                Pet Type<span className="text-red-600">*</span>
              </p>
              <div className="options flex gap-3 justify-around w-full">
                <div className="petType-cat flex flex-row gap-1">
                  <label htmlFor="petType-cat">Cat</label>
                  <input
                    type="radio"
                    id="petType-cat"
                    name="petType"
                    value="cat"
                    required
                  />
                </div>
                <div className="petType-dog flex flex-row gap-1">
                  <label htmlFor="petType-dog">Dog</label>
                  <input
                    type="radio"
                    id="petType-dog"
                    name="petType"
                    value="dog"
                  />
                </div>
                <div className="petType-other flex flex-row gap-1">
                  <label htmlFor="petType-other">Other</label>
                  <input
                    type="radio"
                    id="petType-other"
                    name="petType"
                    value="other"
                  />
                </div>
              </div>
            </div>
            <div className="socials flex gap-2 flex-col items-start w-full">
              <label htmlFor="socials">Social Handle (IG or TikTok)</label>
              <input
                type="text"
                id="socials"
                name="socials"
                className="border rounded-xl px-2 w-full"
              />
            </div>
            <div className="audienceSize flex gap-1 justify-between w-full">
              <label htmlFor="audienceSize" className="w-fit">
                Audience Size:
              </label>
              <select
                name="audienceSize"
                id="audienceSize"
                className="grow border rounded-xl px-2"
                defaultValue=""
              >
                <option value="" className="text-center">
                  N/A
                </option>
                <option value="0 - 1k" className="text-center">
                  0 - 1k
                </option>
                <option value="1 - 10k" className="text-center">
                  1 - 10k
                </option>
                <option value="10 - 50k" className="text-center">
                  10 - 50k
                </option>
                <option value="50k - 250k" className="text-center">
                  50k - 250k
                </option>
                <option value="250k+" className="text-center">
                  250k+
                </option>
              </select>
            </div>
            <div className="message flex flex-col items-start w-full gap-1 ">
              <label htmlFor="message">Note (Optional)</label>
              <textarea
                name="message"
                id="message"
                className="border w-full resize-none rounded-xl p-2"
                placeholder={
                  debouncedPetName &&
                  `Anything you'd like to share about ${debouncedPetName}?`
                }
              ></textarea>
            </div>
            <Button
              className={`mt-5 text-lg text-white font-medium rounded-xl py-1 px-2 w-full ${
                submitDisabled
                  ? `bg-gray-700 cursor-not-allowed hover:bg-gray-700`
                  : `cursor-pointer`
              }`}
            >{isLoading ? (<FontAwesomeIcon icon={faPaw} className="border rounded-full animate-spin ease-in-out"/>) : (<span>Join the waitlist</span> )}</Button>
            <p className="font-light text-center w-full">
              By joining, you’ll receive PawCircle updates and your early access link. Unsubscribe anytime.
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Waitlist;
