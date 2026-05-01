import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    q: "What is PaikarMart?",
    a: "PaikarMart is a multi-vendor marketplace where buyers and sellers connect across retail, wholesale, local commerce, and services.",
  },
  {
    q: "How do I become a seller?",
    a: "Use the seller registration flow from the auth section. After review, your seller dashboard and product tools become available.",
  },
  {
    q: "How does delivery work?",
    a: "Delivery availability depends on vendor location and your selected area. You can use marketplace filters like Near Me for faster options.",
  },
  {
    q: "Can I buy in bulk?",
    a: "Yes. Wholesale vendors and MOQ-friendly items are available in marketplace categories and product listings.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-3 py-4 md:px-4 md:py-6">
      <h1 className="text-2xl font-bold mb-2">Frequently Asked Questions</h1>
      <p className="text-sm text-muted-foreground mb-5">Quick answers for buyers, sellers, and marketplace users.</p>
      <Accordion type="single" collapsible className="w-full rounded-xl border border-white/10 bg-white/5 px-3">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

