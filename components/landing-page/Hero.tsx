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
            Create a profile for your pet.
            <br />
            Loved ones can show Support.
          </h1>
          <p className="text-lg max-md:text-center max-md:text-base">
            You’ll get a shareable page for your pet where your close circle can
            support them. We’re actively inviting early users from the waitlist.
            Join to be included.
          </p>
          <a href="#waitlist">
            <Button className="w-fit cursor-pointer">Join Waitlist</Button>
          </a>
        </div>
        <div className="">
          <Image
            src="/images/iPhones (1).png"
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
