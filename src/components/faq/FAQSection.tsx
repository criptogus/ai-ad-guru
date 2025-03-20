
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, CreditCard, Link as LinkIcon, Zap, Wrench } from "lucide-react";

interface FAQSectionProps {
  title: string;
  icon: React.ReactNode;
  questions: Array<{
    id: string;
    question: string;
    answer: React.ReactNode;
  }>;
}

const FAQSection: React.FC<FAQSectionProps> = ({ title, icon, questions }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {questions.map((faq) => (
          <AccordionItem key={faq.id} value={faq.id}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>
              <div className="prose prose-sm max-w-none">
                {faq.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQSection;
