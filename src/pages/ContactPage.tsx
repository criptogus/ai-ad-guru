
import React from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { ContactHero, ContactInfo, ContactForm } from "@/components/contact";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us | Zero Digital Agency</title>
        <meta name="description" content="Get in touch with Zero Digital Agency for AI-powered ad management and automation." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        {/* Hero section */}
        <ContactHero />

        {/* Contact information */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <ContactInfo />
              </div>
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
