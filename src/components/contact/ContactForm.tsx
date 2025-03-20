
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const ContactForm: React.FC = () => {
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
  );
};

export default ContactForm;
