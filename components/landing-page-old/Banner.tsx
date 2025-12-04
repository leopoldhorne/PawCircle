import { faDollarSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const Banner = () => {
  return (
    <section id="simple-banner" className="">
      <div className="wrapper max-w-6xl mx-auto px-2 py-10 flex flex-col justify-center items-center gap-20 h-full">
        <div className="card border h-100 w-[80%] flex flex-col gap-6 items-center justify-center text-center p-3 rounded-xl border-purple-700 bg-purple-50">
          <div className="icon text-white text-3xl h-15 w-15 bg-purple-700 rounded-full p-3 flex justify-center items-center">
            <FontAwesomeIcon icon={faDollarSign} />
          </div>
          <h4 className="title text-3xl font-bold">Simple and Transparent</h4>
          <p className="para text-base">
           Processing fees apply. PawCircle keeps a 10–15% platform fee to keep the lights on. Creators keep the rest.
          </p>
          <p className="para text-base font-light">
            No surprises. No fine print. Just transparency.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Banner;
