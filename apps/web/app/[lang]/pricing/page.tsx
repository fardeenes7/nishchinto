import en from "@/dictionaries/en.json";
import bn from "@/dictionaries/bn.json";
import { Check, Info, Plus } from "lucide-react";
import { Button } from "@repo/ui/components/ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/ui/tabs";
import { Separator } from "@repo/ui/components/ui/separator";

const dictionaries = { en, bn };

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = dictionaries[lang as keyof typeof dictionaries] ?? dictionaries.en;
  const pricing = dict.pricing;

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/50">
            {pricing.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {pricing.subtitle}
          </p>
        </div>

        {/* Pricing Content */}
        <Tabs defaultValue="yearly" className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="h-12 p-1 bg-muted/50 rounded-full border backdrop-blur-sm">
              <TabsTrigger value="monthly" className="rounded-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-md font-semibold transition-all">
                {pricing.monthly}
              </TabsTrigger>
              <TabsTrigger value="yearly" className="rounded-full px-8 data-[state=active]:bg-background data-[state=active]:shadow-md font-semibold transition-all">
                {pricing.yearly}
                <span className="ml-2 text-[10px] font-black uppercase text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  {pricing.save_percent}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="yearly" className="mt-0 animate-in fade-in zoom-in-95 duration-500">
             <PricingGrid tiers={pricing.tiers} dict={pricing} lang={lang} isYearly={true} />
          </TabsContent>
          <TabsContent value="monthly" className="mt-0 animate-in fade-in zoom-in-95 duration-500">
             <PricingGrid tiers={pricing.tiers} dict={pricing} lang={lang} isYearly={false} />
          </TabsContent>
        </Tabs>

        {/* Comparison Section (The Linear Look) */}
        <section id="comparison" className="mt-40">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Compare Features</h2>
              <p className="text-muted-foreground">Every detail you need to choose the right plan.</p>
           </div>
           
           <div className="max-w-5xl mx-auto overflow-hidden rounded-3xl border bg-background/50 backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-muted/30">
                         <th className="p-6 text-sm font-bold border-b">Feature</th>
                         <th className="p-6 text-sm font-bold border-b text-center">Starter</th>
                         <th className="p-6 text-sm font-bold border-b text-center">Basic</th>
                         <th className="p-6 text-sm font-bold border-b text-center bg-primary/5">Pro</th>
                         <th className="p-6 text-sm font-bold border-b text-center">Business</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-border">
                      {[
                        ["Active Storefronts", "1", "3", "Unlimited", "Unlimited"],
                        ["Monthly Products", "5", "50", "Unlimited", "Unlimited"],
                        ["AI Messenger Support", "No", "Basic", "Advanced (Plus)", "Enterprise"],
                        ["Custom Domains", "No", "Yes", "Yes", "Yes"],
                        ["Analytics", "Basic", "Pro", "Advanced", "Full Suite"],
                        ["Inventory Sync", "Manual", "Auto", "Real-time", "Real-time + API"],
                        ["Support", "Standard", "Priority", "24/7 Priority", "Dedicated Manager"],
                      ].map((row, i) => (
                         <tr key={i} className="hover:bg-muted/10 transition-colors text-nowrap">
                            <td className="p-6 text-sm font-medium">{row[0]}</td>
                            <td className="p-6 text-sm text-center text-muted-foreground">{row[1]}</td>
                            <td className="p-6 text-sm text-center text-muted-foreground">{row[2]}</td>
                            <td className="p-6 text-sm text-center font-semibold bg-primary/5">{row[3]}</td>
                            <td className="p-6 text-sm text-center text-muted-foreground">{row[4]}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
              </div>
           </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-40 max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold text-center mb-16">Frequently Asked Questions</h2>
           <div className="space-y-8">
              {[
                { q: "Can I upgrade or downgrade my plan at any time?", a: "Yes, you can change your plan whenever you need. Changes are prorated for the remainder of your billing cycle." },
                { q: "Is there a limit on how many orders I can process?", a: "No, we don't limit your order volume on any plan. We grow with you." },
                { q: "Do you offer localized support in Bengali?", a: "Absolutely. Our entire support team and all AI modules are fully bilingual (English & Bengali)." },
              ].map((faq, i) => (
                <div key={i} className="group">
                   <h3 className="text-lg font-bold mb-3 flex items-center gap-3">
                      <Plus className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" />
                      {faq.q}
                   </h3>
                   <p className="text-muted-foreground leading-relaxed pl-7">
                      {faq.a}
                   </p>
                </div>
              ))}
           </div>
        </section>
        {/* Contact Sales Banner */}
        <section className="mt-40 p-12 rounded-[3rem] bg-muted/30 border text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
           <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Need something different?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                 We offer custom solutions for large-scale operations, including dedicated infrastructure and enterprise-grade security.
              </p>
              <Button asChild size="lg" className="rounded-full px-10 font-bold">
                 <Link href={`/${lang}/contact`}>{pricing.cta_contact}</Link>
              </Button>
           </div>
        </section>
      </div>
    </main>
  );
}

function PricingGrid({ tiers, dict, lang, isYearly }: { tiers: any, dict: any, lang: string, isYearly: boolean }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {Object.entries(tiers).map(([key, tier]: [string, any], i: number) => {
        const isPro = key === 'pro';
        const price = isYearly ? Math.floor(parseInt(tier.price) * 0.8) : tier.price;
        
        return (
          <div key={key} className={`relative flex flex-col p-8 rounded-[2.5rem] border bg-background transition-all duration-500 hover:scale-[1.02] ${isPro ? 'ring-2 ring-primary shadow-2xl shadow-primary/20 bg-muted/50' : 'bg-background hover:border-primary/50'}`}>
            {isPro && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                Recommended
              </div>
            )}
            
            <div className="mb-10">
              <h3 className={`text-xl font-bold mb-4 ${isPro ? 'text-primary' : ''}`}>{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-5xl font-black">৳{price}</span>
                <span className="text-muted-foreground text-sm font-medium">/mo</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px]">
                {tier.description}
              </p>
            </div>

            <Button asChild variant={isPro ? "default" : "outline"} className={`w-full h-12 text-base font-bold rounded-2xl mb-12 shadow-sm ${isPro ? 'bg-primary hover:bg-primary/90' : 'hover:bg-primary/5'}`}>
              <Link href={`/${lang}/signup?plan=${key}`}>{dict.cta}</Link>
            </Button>

            <div className="space-y-6 grow">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                Features
                <Separator className="grow opacity-20" />
              </p>
              <ul className="space-y-4">
                {tier.features.map((feature: string, j: number) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 rounded-full bg-primary/10 p-0.5 shrink-0">
                       <Check className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
