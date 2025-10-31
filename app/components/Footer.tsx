import React from "react";

const Footer = () => {
  return (
    <footer className="bg-purple-700">
      <div className="wrapper max-w-6xl mx-auto px-2 py-10 flex flex-col justify-center items-center gap-10 h-full text-white max-sm:gap-5">
        <div className="top w-full">
          <div className="center flex justify-around max-sm:flex-col max-sm:items-center max-sm:gap-3">
            <a href="#how-it-works" className="text-xl">
              How it works
            </a>
            <a href="#why" className="text-xl">
              For Parents
            </a>
            <a href="#why" className="text-xl">
              For Supporters
            </a>
            <a href="#faq" className="text-xl">
              FAQ
            </a>
          </div>
        </div>
        <div className="bottom text-lg font-light text-center">
          <p>Copyright © 2025 PawCircle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
