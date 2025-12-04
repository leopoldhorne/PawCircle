import {
  faArrowRight,
  faFileAlt,
  faUsers,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import WorksCard from "../ui/WorksCard"; 

const HowItWorks = () => {
  const howItWorks = [
    {
      icon: faFileAlt,
      title: "Create your pet's page",
      para: "Add your story, set simple perks, and list real needs in a wishlist.",
    },
    {
      icon: faUsers,
      title: "Invite your village",
      para: "Share your link so friends and fans can chip in monthly or one time.",
    },
    {
      icon: faVideo,
      title: "Share updates",
      para: "Post photos, short videos, and milestones so supporters feel close to your pet.",
    },
  ];

  return (
    <section id="how-it-works">
      <div className="wrapper max-w-6xl mx-auto px-2 py-10 flex flex-col justify-center items-center gap-20 h-full">
        <h2 className="title text-5xl  font-bold text-center w-[90%] max-sm:text-4xl">
          How it works
        </h2>
        <div className="cards flex flex-row gap-5 justify-center max-md:flex-col max-md:items-center">
          {howItWorks.map((work, index) => (
            <WorksCard
              key={index}
              icon={work.icon}
              title={work.title}
              para={work.para}
            />
          ))}
        </div>
        <a
          href="#waitlist"
          className="text-lg text-white font-medium bg-purple-700 rounded-xl py-1 px-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ease-in-out duration-300"
        >
          <button className="cursor-pointer">
            Join the waitlist{" "}
            <FontAwesomeIcon icon={faArrowRight} className="" />
          </button>
        </a>
      </div>
    </section>
  );
};

export default HowItWorks;
