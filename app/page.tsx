import React from "react";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import WhySection from "./components/WhySection";
import Banner from "./components/Banner";
import Waitlist from "./components/Waitlist";
import FAQSetion from "./components/FAQSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
    <Hero />
    <HowItWorks />
    <WhySection />
    <Banner/>
    <Waitlist />
    <FAQSetion/>
    <Footer />
    </>
  );
}
