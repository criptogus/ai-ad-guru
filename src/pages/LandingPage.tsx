
import React from "react";
import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Process } from "@/components/landing/Process";
import { Pricing } from "@/components/landing/Pricing";
import { Trust } from "@/components/landing/Trust";
import { Cta } from "@/components/landing/Cta";
import { Footer } from "@/components/landing/Footer";
import { LoginButton } from "@/components/landing/LoginButton";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <LoginButton />
      <Features />
      <Process />
      <Pricing />
      <Trust />
      <Cta />
      <Footer />
    </div>
  );
};

export default LandingPage;
