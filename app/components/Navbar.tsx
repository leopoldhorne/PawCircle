import { faBars, faPaw } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction } from "react";

interface NavProps {
    navOpen: boolean,
    setNavOpen: Dispatch<SetStateAction<boolean>>
}

const Navbar = ({navOpen, setNavOpen}: NavProps) => {
  return (
    <nav className="min-h-20">
      <div className="wrapper h-full max-w-6xl mx-auto px-2 py-2 flex justify-between items-center">
        <div className="logo text-2xl group cursor-not-allowed flex justify-center gap-1 items-center">
          <div className="icon-wrapper h-8 w-8 overflow-hidden flex items-center justify-center">
            <FontAwesomeIcon
              icon={faPaw}
              className="text-purple-600 group-hover:text-purple-500 ease-in-out duration-300 border-2 rounded-full p-0.5"
            />
          </div>

          <span className="text-purple-700 font-bold group-hover:text-purple-500 ease-in-out duration-300">
            PawCircle
          </span>
        </div>
        <div className="center flex gap-6 max-lg:hidden">
          <a
            href="#how-it-works"
            className="text-xl hover:text-purple-500 ease-in-out duration-300"
          >
            How it works
          </a>
          <a
            href="#why"
            className="text-xl hover:text-purple-500 ease-in-out duration-300"
          >
            For Parents
          </a>
          <a
            href="#why"
            className="text-xl hover:text-purple-500 ease-in-out duration-300"
          >
            For Supporters
          </a>
          <a
            href="#faq"
            className="text-xl hover:text-purple-500 ease-in-out duration-300"
          >
            FAQ
          </a>
        </div>
        <div className="cta max-lg:hidden">
          <button className="text-lg text-white font-medium bg-purple-700 rounded-xl py-1 px-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ease-in-out duration-300">
            Join the waitlist
          </button>
        </div>
        <div className="lg:hidden cursor-pointer size-fit overflow-hidden">
          <FontAwesomeIcon icon={faBars} className="text-3xl" onClick={() => setNavOpen(true)}/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
