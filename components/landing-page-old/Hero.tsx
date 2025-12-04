"use client"

import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import Navbar from "./Navbar";
import NavMenu from "./NavMenu";

const Hero = () => {
  const[navOpen, setNavOpen] = useState<boolean>(false)
  
  
  return (
    <header className="h-screen flex flex-col justify-center bg-purple-50">
      <NavMenu navOpen={navOpen} setNavOpen={setNavOpen}/>
      <Navbar navOpen={navOpen} setNavOpen={setNavOpen}/>
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex flex-col justify-center items-center gap-5 h-full">
        <h1 className="title text-6xl font-bold text-center w-[90%] max-sm:text-5xl max-sm:w-[95%]">
          Raise your fur baby with a village
        </h1>
        <p className="title text-3xl text-center w-[90%] max-sm:text-xl">
          PawCircle makes it easy for friends and fans to chip in for real care
          and get adorable updates in return.
        </p>
        <div className="cta flex gap-7 items-center max-sm:flex-col">
          <a
            href="#waitlist"
            className="text-lg text-white font-medium bg-purple-700 rounded-xl py-1 px-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ease-in-out duration-300"
          >
            <button className="cursor-pointer">
              Join the waitlist{" "}
              <FontAwesomeIcon icon={faArrowRight} className="" />
            </button>
          </a>
          <a
            href="#how-it-works"
            className=" text-lg underline text-purple-700 hover:text-purple-500 ease-in-out duration-300"
          >
            See how it works
          </a>
        </div>
      </div>
    </header>
  );
};

export default Hero;
