import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is PaikarMart?",
    answer: "PaikarMart is a premium multi-vendor eCommerce marketplace connecting buyers with wholesalers, retailers, brand sellers, and local shops across Bangladesh."
  },
  {
    question: "How do I become a seller?",
    answer: "You can apply to become a seller by clicking the 'Become a Seller' link in the footer or homepage. Fill out the registration form with your business details, and our admin team will review your application."
  },
  {
    question: "What payment methods are accepted?",
    answer: "Currently, we support Cash on Delivery (COD). We will be adding online payment gateways (bKash, Nagad, Cards) soon."
  },
  {
    question: "How does wholesale pricing work?",
    answer: "Wholesale sellers may set a Minimum Order Quantity (MOQ). Once your cart quantity meets the MOQ for that product, the wholesale price will be applied automatically."
  },
  {
    question: "What is the delivery time?",
    answer: "Delivery time varies depending on the seller and your location. Typically, deliveries within Dhaka take 1-3 days, and outside Dhaka take 3-5 days."
  }
];

export default function FAQPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">Find answers to common questions about buying and selling on PaikarMart.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Layout>
  );
}
