import { WaitlistForm } from "@/components/WaitlistForm";
import { CheckCircle2, Sparkles } from "lucide-react";

export function Waitlist({ dict }: { dict: any }) {
  return (
    <section id="waitlist" className="py-24 lg:py-32 bg-primary text-primary-foreground overflow-hidden relative">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-white/10 rounded-full blur-[100px] -ml-20 -mb-20" />
      
      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4" />
              Limited Beta Access
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {dict.waitlist.title}
            </h2>
            
            <p className="text-xl opacity-90 leading-relaxed">
              {dict.waitlist.subtitle}
            </p>
            
            <ul className="space-y-4">
              {[
                "Early access to premium features",
                "Dedicated onboarding support",
                "Special beta-launch pricing"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <span className="text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-background text-foreground p-8 lg:p-12 rounded-[2rem] shadow-2xl shadow-black/20 relative group">
             {/* Decorative Corner */}
             <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                <Sparkles className="w-6 h-6 text-white" />
             </div>
             
             <h3 className="text-2xl font-bold mb-8">Reserve Your Spot</h3>
             <WaitlistForm />
          </div>
        </div>
      </div>
    </section>
  );
}
