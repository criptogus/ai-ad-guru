
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Footer } from "@/components/landing/Footer";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us | Zero Digital Agency</title>
        <meta name="description" content="Get in touch with Zero Digital Agency for AI-powered ad management and automation." />
      </Helmet>
      <Nav />
      <main className="flex-grow">
        {/* Hero section */}
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

        {/* Contact information */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">📧 Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-brand-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Address</h3>
                      <p className="text-gray-600">[Company Address]</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 text-brand-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-gray-600">[Company Phone]</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-brand-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-600">support@zerodigital.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-6 w-6 text-brand-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9 AM - 6 PM (UTC)</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">📋 Contact Form</h2>
                <p className="mb-6 text-gray-600">Fill out the form below, and we'll get back to you as soon as possible.</p>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Your Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Your Message *</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      rows={5} 
                      value={formData.message}
                      onChange={handleChange}
                      required 
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
                
                <div className="mt-6 text-sm text-gray-600">
                  <p>✅ Response time: Our team typically responds within 24 hours.</p>
                  <p className="mt-2">📌 Need urgent help? Email us directly at <span className="font-semibold">contact@zerodigital.com</span>.</p>
                </div>
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
