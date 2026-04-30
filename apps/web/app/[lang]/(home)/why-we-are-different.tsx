"use client";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { cn } from "@repo/ui/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";

export default function WhyWeAreDifferent({ dict }: { dict: any }) {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const data = dict.services.items;

    const handleMouseEnter = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <section className="bg-background">
            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 lg:py-20 sm:py-16 py-8">
                <div className="flex flex-col sm:gap-16 gap-8">
                    <div className="flex md:flex-row flex-col justify-between md:items-end items-start gap-4">
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-left-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                            <Badge
                                variant="outline"
                                className="py-1 px-3 h-auto text-sm font-normal border-0 outline outline-border text-primary bg-primary/5"
                            >
                                {dict.services.badge}
                            </Badge>
                            <h2 className="sm:text-5xl text-3xl text-foreground font-bold tracking-tight">
                                {dict.services.title}
                            </h2>
                            <p className="max-w-2xl text-muted-foreground sm:text-lg text-base">
                                {dict.services.subtitle}
                            </p>
                        </div>
                        <Button
                            className={
                                "group p-1 bg-primary hover:bg-primary/80 text-white font-medium flex gap-2 lg:gap-3 justify-between items-center rounded-full w-fit ps-5 h-auto border-0 animate-in fade-in slide-in-from-right-10 duration-1000 delay-200 ease-in-out fill-mode-both"
                            }
                        >
                            <a
                                href="#waitlist"
                                className="flex items-center gap-3 text-primary-foreground text-sm font-medium"
                            >
                                {dict.services.cta}
                                <div className="p-2 bg-background rounded-full group-hover:rotate-45 transition-transform duration-300 ease-in-out">
                                <IconArrowRight
                                        className="text-foreground"
                                        width={16}
                                        height={16}
                                    />
                                </div>
                            </a>
                        </Button>
                    </div>
                    <div className="grid grid-cols-12 relative gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-in-out fill-mode-both">
                        <div className="w-full lg:col-span-4 col-span-12 flex items-center justify-center">
                            <div
                                className={`transition-all duration-300 z-10 h-80`}
                            >
                                {data?.[activeIndex]?.image && (
                                    <Image
                                        src={data[activeIndex].image}
                                        alt={data[activeIndex].heading}
                                        width={600}
                                        height={400}
                                        className="w-full h-full object-cover rounded-xl shadow-lg border border-border/50"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="lg:col-span-1" />
                        <div className="w-full flex flex-col gap-16 lg:col-span-7 col-span-12">
                            <div>
                                {data?.map((value:any, index:number) => (
                                    <div
                                        key={index}
                                        onMouseEnter={(e) =>
                                            handleMouseEnter(index)
                                        }
                                        className="group py-6 xl:py-10 border-t border-border cursor-pointer flex xl:flex-row flex-col xl:items-center items-start justify-between xl:gap-10 gap-1 relative"
                                    >
                                        <h3
                                            className={cn(
                                                "group-hover:text-primary py-1 text-2xl md:text-3xl font-semibold text-foreground w-full transition-colors",
                                                activeIndex === index
                                                    ? "text-primary"
                                                    : ""
                                            )}
                                        >
                                            {value.heading}
                                        </h3>
                                        {activeIndex === index && (
                                            <p className="text-muted-foreground text-base transition-all duration-300 flex-1">
                                                {value.descp}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

