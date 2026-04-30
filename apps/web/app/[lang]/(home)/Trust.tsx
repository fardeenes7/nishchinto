export function Trust({ dict }: { dict: any }) {
  return (
    <section className="py-20 lg:py-24 border-y bg-background/50">
      <div className="container px-4 md:px-6 mx-auto">
        <h2 className="text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-12">
          {dict.trust.title}
        </h2>
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
           {/* Abstract placeholders for logos */}
           <div className="flex items-center gap-2 group cursor-default">
              <div className="w-8 h-8 bg-foreground rounded flex items-center justify-center font-black text-xs text-background">S</div>
              <span className="text-xl font-black tracking-tighter uppercase">Store.One</span>
           </div>
           <div className="flex items-center gap-2 group cursor-default">
              <div className="w-8 h-8 border-4 border-foreground rounded-full" />
              <span className="text-xl font-black tracking-tighter uppercase">Local.Biz</span>
           </div>
           <div className="flex items-center gap-2 group cursor-default">
              <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center">
                 <div className="w-4 h-4 bg-background rounded-sm rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Grow.Dev</span>
           </div>
           <div className="flex items-center gap-2 group cursor-default">
              <div className="w-0 h-0 border-l-15 border-l-transparent border-r-15 border-r-transparent border-b-25 border-b-foreground" />
              <span className="text-xl font-black tracking-tighter uppercase">Fast.Sell</span>
           </div>
        </div>
      </div>
    </section>
  );
}
