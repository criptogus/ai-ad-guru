
import React from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { TestimonialsHero, TestimonialCard, TestimonialCTA } from "@/components/testimonials";

const TestimonialsPage: React.FC = () => {
  const testimonials = [
    {
      id: "testimonial-1",
      text: "I was skeptical about AI managing my ads, but Zero Digital Agency has been a game-changer. My conversion rates increased by 42% within the first month! The AI suggestions are spot-on, and I love that I can manage all my campaigns in one place.",
      author: "Sarah M.",
      position: "Founder",
      company: "EcomBoost",
      stars: 5
    },
    {
      id: "testimonial-2",
      text: "Managing ads across multiple platforms used to take up half my day. Now, I just set up my campaigns in Zero Digital Agency, and the AI does the rest! The automated optimizations alone make this service worth every penny.",
      author: "David R.",
      position: "Marketing Director",
      company: "SaaSFlow",
      stars: 5
    },
    {
      id: "testimonial-3",
      text: "Before using Zero Digital Agency, I was spending a fortune on underperforming ads. The AI insights helped me cut costs by 30% while increasing ROI. I highly recommend this platform!",
      author: "Jessica L.",
      position: "Owner",
      company: "Luxe Jewelry",
      stars: 5
    },
    {
      id: "testimonial-4",
      text: "I've used several AI marketing tools, but none come close to Zero Digital Agency. Their AI-generated ad copy is on point, and the real-time analytics give me full control over my campaigns. If you're serious about scaling, this is the way to go.",
      author: "Mark T.",
      position: "CEO",
      company: "GrowthHackers.io",
      stars: 5
    },
    {
      id: "testimonial-5",
      text: "As a startup founder, I didn't have time to figure out ad strategies. Zero Digital Agency handled everything with AI, and within two months, we doubled our customer base. The automation is seamless, and the insights are invaluable.",
      author: "Emma W.",
      position: "Co-Founder",
      company: "FitFusion",
      stars: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Client Testimonials | Zero Digital Agency</title>
        <meta name="description" content="See what our clients say about Zero Digital Agency's AI-powered ad management platform. Real results from real businesses using our automated ad optimization." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        <TestimonialsHero />
        
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold mb-8 text-center">💬 What Our Clients Are Saying</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  text={testimonial.text}
                  author={testimonial.author}
                  position={testimonial.position}
                  company={testimonial.company}
                  stars={testimonial.stars}
                />
              ))}
            </div>
          </div>
        </section>
        
        <TestimonialCTA />
      </main>
      <Footer />
    </div>
  );
};

export default TestimonialsPage;
