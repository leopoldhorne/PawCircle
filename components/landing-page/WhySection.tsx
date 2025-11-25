import { faCheckDouble, faClipboardList, faHandHoldingHeart, faHandshake, faHandsHoldingCircle, faParachuteBox } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import WhyCard from "../ui/WhyCard";

const WhySection = () => {
  const parents =[
          {icon: faHandHoldingHeart, title: "Predictable support", para: "Steady help for food, meds, and vet"},
          {icon: faCheckDouble, title: "Easy updates", para: "Post updates in minutes from your phone"},
          {icon: faClipboardList, title: "Care wishlist", para: "Real needs, real impact on your fur baby"}
      ]
  const supporters =[
          {icon: faHandshake, title: "Feel closer", para: "Cute updates, pictures and milestones"},
          {icon: faHandsHoldingCircle, title: "See impact", para: "Watch how your support helps daily care"},
          {icon: faParachuteBox, title: "Flexible support", para: "Choose monthly or one time contributions"}
      ]
  
    return (
    <section id="why" className="bg-purple-50">
      <div className="wrapper max-w-6xl w-full mx-auto px-2 py-10 flex flex-col justify-center items-center gap-20 h-full">
        <h2 className="title text-5xl  font-bold text-center w-[90%] max-sm:text-4xl">
          Why PawCircle
        </h2>
        <div className="parents flex flex-col items-center gap-5 justify-center w-full">
          <h3 className="text-3xl font-bold text-purple-600">For Parents</h3>
          <div className="cards flex flex-row gap-5 justify-center w-full max-md:flex-col max-md:items-center">
            {
                parents.map((info, index) => (<WhyCard key={index} icon={info.icon} title={info.title} para={info.para} />))
            }
          </div>
        </div>
        <div className="supporters flex flex-col items-center gap-5 justify-center w-full">
          <h3 className="text-3xl font-bold text-purple-600">For Supporters</h3>
          <div className="cards flex flex-row gap-5 justify-center w-full max-md:flex-col max-md:items-center">
            {
                supporters.map((info, index) => (<WhyCard key={index} icon={info.icon} title={info.title} para={info.para} />))
            }
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
