
import React from "react";

const ContactHero: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white py-16 px-4">
      <div className="container mx-auto max-w-5xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">📞 Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Have questions? Need support? We're here to help!
        </p>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          For any inquiries, support requests, or business opportunities, feel free to reach out to our team.
        </p>
      </div>
    </section>
  );
};

export default ContactHero;
