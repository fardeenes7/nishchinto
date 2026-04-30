import { CheckCircle2, MessageSquare, Bot, BarChart3 } from "lucide-react";

export function Features({ dict }: { dict: any }) {
    const features = dict.features.detailed;
    const icons = [MessageSquare, Bot, BarChart3];

    return (
        <section id="features" className="py-24 lg:py-32 bg-muted/30">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        {dict.features.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {dict.features.subtitle}
                    </p>
                </div>

                <div className="space-y-24 lg:space-y-32">
                    {features.map((feature: any, i: number) => {
                        const Icon = icons[i] || MessageSquare;
                        const isEven = i % 2 === 0;

                        return (
                            <div
                                key={i}
                                className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                                    !isEven ? "lg:flex-row-reverse" : ""
                                }`}
                            >
                                <div
                                    className={`space-y-6 ${!isEven ? "lg:order-2" : ""}`}
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground">
                                        {feature.description}
                                    </p>
                                    <ul className="space-y-3">
                                        {feature.bullets.map(
                                            (bullet: string, j: number) => (
                                                <li
                                                    key={j}
                                                    className="flex items-center gap-3"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                                    <span className="font-medium text-muted-foreground">
                                                        {bullet}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <div
                                    className={`relative flex items-center justify-center ${
                                        !isEven ? "lg:order-1" : ""
                                    }`}
                                >
                                    <div className="relative w-full aspect-[4/3] max-w-[500px]">
                                        {/* Abstract Illustration for Feature */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl" />

                                        <div className="relative z-10 w-full h-full flex items-center justify-center">
                                            {/* Floating Abstract Shapes */}
                                            <div className="absolute w-40 h-40 bg-primary/20 rounded-full blur-2xl animate-blob" />
                                            <div
                                                className={`absolute w-24 h-24 bg-background border-2 border-primary/20 rounded-2xl shadow-xl flex items-center justify-center animate-bounce duration-[${4000 + i * 1000}ms] shadow-primary/5`}
                                            >
                                                <Icon className="w-12 h-12 text-primary" />
                                            </div>

                                            {/* SVG Decorative Lines */}
                                            <svg
                                                className="absolute inset-0 w-full h-full -z-10 opacity-30"
                                                viewBox="0 0 100 100"
                                            >
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="30"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="0.5"
                                                    className="text-primary"
                                                    strokeDasharray="2 2"
                                                />
                                                <rect
                                                    x="20"
                                                    y="20"
                                                    width="60"
                                                    height="60"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="0.2"
                                                    className="text-primary"
                                                />
                                                <path
                                                    d="M10,50 L90,50"
                                                    stroke="currentColor"
                                                    strokeWidth="0.1"
                                                    className="text-primary"
                                                />
                                                <path
                                                    d="M50,10 L50,90"
                                                    stroke="currentColor"
                                                    strokeWidth="0.1"
                                                    className="text-primary"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
