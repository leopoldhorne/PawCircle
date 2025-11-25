import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface WhyCard {
    icon: IconProp
    title: string
    para: string
}

const WorksCard = ({icon, title, para}: WhyCard) => {
  return (
    <div className="card border h-50 w-[35%] max-md:w-[80%] flex flex-col gap-3 items-start justify-center p-3 rounded-xl border-purple-700 bg-white hover:-translate-y-1 hover:shadow-xl duration-500 ease-initial">
      <div className="icon text-white text-xl h-10 w-10 bg-purple-700 rounded-full p-1 flex justify-center items-center">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h4 className="title text-lg font-bold">{title}</h4>
      <p className="para text-base">
        {para}
      </p>
    </div>
  );
};

export default WorksCard;
