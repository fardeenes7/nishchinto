import { Check, X } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";

export function PricingTeaser({ dict, lang }: { dict: any; lang: string }) {
  const tiers = [
    { name: "Free", price: "0", features: ["1 Store", "5 Products", "Basic Analytics"], highlighted: false },
    { name: "Basic", price: "990", features: ["3 Stores", "50 Products", "Custom Domains"], highlighted: false },
    { name: "Pro", price: "1,990", features: ["Unlimited Stores", "Unlimited Products", "AI Chatbot Plus"], highlighted: true },
    { name: "Business", price: "4,990", features: ["All Pro Features", "Developer API", "B2B Store Credit"], highlighted: false },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that fits your business. Upgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tiers.map((tier, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-3xl border transition-all duration-300 ${
                tier.highlighted
                  ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-105 z-10 border-transparent"
                  : "bg-background hover:border-primary/50"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">৳{tier.price}</span>
                  <span className={`text-sm ${tier.highlighted ? "opacity-80" : "text-muted-foreground"}`}>/mo</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm">
                    <Check className={`w-4 h-4 ${tier.highlighted ? "text-white" : "text-primary"}`} />
                    <span className={tier.highlighted ? "opacity-90" : "text-muted-foreground"}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.highlighted ? "secondary" : "outline"}
                className={`w-full h-11 font-bold rounded-xl ${tier.highlighted ? "bg-white text-primary hover:bg-white/90" : ""}`}
              >
                <Link href={`/${lang}/pricing`}>Get Started</Link>
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <Link href={`/${lang}/pricing`} className="text-sm font-bold text-primary hover:underline flex items-center justify-center gap-2">
              View full feature comparison
              <Check className="w-4 h-4" />
           </Link>
        </div>
      </div>
    </section>
  );
}
