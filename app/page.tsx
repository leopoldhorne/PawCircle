import React from "react";
import Hero from "@/components/landing-page/Hero";
import HowItWorks from "@/components/landing-page/HowItWorks";
import WhySection from "@/components/landing-page/WhySection";
import Banner from "@/components/landing-page/Banner";
import Waitlist from "@/components/landing-page/Waitlist";
import FAQSetion from "@/components/landing-page/FAQSection";
import Footer from "@/components/landing-page/Footer";

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
