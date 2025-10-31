import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Dispatch, SetStateAction } from "react";

interface NavProps {
    navOpen: boolean,
    setNavOpen: Dispatch<SetStateAction<boolean>>
}

const NavMenu = ({navOpen, setNavOpen}: NavProps) => {
    return (
        <nav className={`flex flex-col justify-start items-between gap-30 bg-white h-screen w-screen p-10 ${navOpen ? `fixed` : `hidden`}`}>
            <div className="size-fit self-end">
                <FontAwesomeIcon icon={faXmark} className="text-2xl cursor-pointer" onClick={() => setNavOpen(false)}/>
            </div>
            <div className="flex flex-col items-center text-center gap-5">
                <a href="#how-it-works" className="text-lg" onClick={() => setNavOpen(false)}>How it works</a>
                <a href="#why" className="text-lg" onClick={() => setNavOpen(false)}>For Parents</a>
                <a href="#why" className="text-lg" onClick={() => setNavOpen(false)}>For Supporters</a>
                <a href="#faq" className="text-lg" onClick={() => setNavOpen(false)}>FAQ</a>
                <a href="#waitlist" className="text-lg" onClick={() => setNavOpen(false)}><button className="text-lg text-white font-medium bg-purple-700 rounded-xl py-1 px-2 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ease-in-out duration-300">
            Join the waitlist
          </button></a>
            </div>
        </nav>
    );
}

export default NavMenu;
