"use client";

import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

const FAQSetion = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What makes PawCircle different?",
      answer:
        "It's built for pets and the people who love them. Instead of random tips, it's a space for real care, updates, and gentle support.",
    },
    {
      question: "How can people support my pet?",
      answer:
        "Your village can help however they like. They can chip in once, give monthly, or gift items from your wishlist. Everything goes toward real care and happy updates.",
    },
    {
      question: "Who can join PawCircle?",
      answer:
        "Any pet parent can join. Dogs, cats, bunnies, birds, and all furry, scaly, or feathery friends are welcome.",
    },
    {
      question: "Can I stay private?",
      answer:
        "Yes. You control what you share. You can use a nickname or even post under your pet’s name.",
    },
    {
      question: "How is PawCircle different from Patreon?",
      answer:
        "PawCircle is focused on care, not content. It’s designed for quick updates, wishlists, and transparent support for pets.",
    },
    {
      question: "When will PawCircle launch?",
      answer:
        "Early members will be invited soon. Join the waitlist to help shape version one and get early access.",
    },
    {
      question: "How much goes to the pet?",
      answer:
        "Pet parents keep about 85 to 90 percent after small processing and platform fees. No hidden costs, ever.",
    },
  ];

  const toggleFAQ = (index: number | null) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="">
      <div className="wrapper max-w-6xl mx-auto px-2 py-10 flex flex-col justify-center items-center gap-10 h-full">
        <h4 className="title text-5xl font-bold text-center max-sm:text-4xl">
          Frequently Asked Questions
        </h4>
        <div className="max-w-3xl mx-auto space-y-4 max-sm:w-[80%]">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-purple-700 rounded-xl overflow-hidden bg-purple-50 hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-purple-100 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-bold text-[#0F0B1A] text-lg font-['Poppins']">
                  {faq.question}
                </span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-purple-700 transition-transform duration-300 shrink-0 ml-4 cursor-pointer ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 leading-relaxed">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSetion;
