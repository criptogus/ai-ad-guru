
import React from "react";
import { Mail, Phone, Clock, MapPin } from "lucide-react";

const ContactInfo: React.FC = () => {
  return (
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
  );
};

export default ContactInfo;
