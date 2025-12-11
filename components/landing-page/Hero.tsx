import Image from "next/image";
import { Button } from "../ui/button";
import Logo from "../logo/logo";

const Hero = () => {
  return (
    <header className="min-h-screen flex flex-col bg-purple-50 justify-center relative">
      <nav className="w-full h-20 top-0 absolute px-2">
        <div className="wrapper max-w-6xl mx-auto py-2 flex justify-between items-center gap-1 h-full w-full">
          <div className="flex gap-1">
            <Logo />
            <span className="text-2xl text-purple-600 font-bold">
              PawCircle
            </span>
          </div>
          <a href="/auth">
            <Button className="w-30 cursor-pointer">Sign In</Button>
          </a>
        </div>
      </nav>
      <div className="wrapper max-w-6xl mx-auto px-2 py-2 flex justify-between items-center gap-1 h-full w-full max-md:flex-col max-md:gap-5 max-md:mt-25">
        <div className="flex flex-col gap-5 max-md:items-center">
          <h1 className="text-4xl font-bold text-black justify-start max-md:text-center max-md:text-2xl">
            Fans already love your pet, so give them a cute place to send gifts
          </h1>
          <p className="text-lg max-md:text-center max-md:text-base">
            Make a page for your pet, add it to your bio, and let fans send gifts with one easy tap
          </p>
          <a href="#waitlist">
            <Button className="w-fit cursor-pointer">Get Early Access</Button>
          </a>
        </div>
        <div className="">
          <Image
            src="/images/iPhones (2).png"
            width={1000}
            height={1000}
            alt="iPhones that showcase the PawCircle Pet Profiles"
          />
        </div>
      </div>
    </header>
  );
};

export default Hero;
