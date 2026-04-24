import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { IconPlus, IconGripVertical, IconPencil, IconTrash, IconEyeOff } from "@tabler/icons-react";
import { Badge } from "@repo/ui/components/ui/badge";

const MOCK_FAQS = [
    {
        id: 1,
        category: "Return Policy",
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery. The item must be unused and in its original packaging.",
        isActive: true,
    },
    {
        id: 2,
        category: "Shipping Policy",
        question: "How long does delivery take?",
        answer: "Inside Dhaka: 1-2 days. Outside Dhaka: 3-5 days via Pathao.",
        isActive: true,
    },
    {
        id: 3,
        category: "FAQ",
        question: "Do you have a physical store?",
        answer: "We are an online-only business currently. This allows us to keep our prices competitive.",
        isActive: false,
    }
];

export default function FAQSettingsPage() {
    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">FAQ & Policies</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage your shop's frequently asked questions and policies. These are used by the AI Chatbot to answer customer queries automatically.
                    </p>
                </div>
                <Button>
                    <IconPlus className="size-4 mr-2" />
                    Add Entry
                </Button>
            </div>

            <div className="flex flex-col gap-4">
                {MOCK_FAQS.map((faq) => (
                    <Card key={faq.id} className={!faq.isActive ? "opacity-60" : ""}>
                        <div className="flex p-4 gap-4 items-start">
                            <div className="cursor-grab mt-1 text-muted-foreground">
                                <IconGripVertical className="size-5" />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-xs">{faq.category}</Badge>
                                            {!faq.isActive && <Badge variant="secondary" className="text-xs">Draft</Badge>}
                                        </div>
                                        <h3 className="font-medium text-sm">{faq.question}</h3>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <IconEyeOff className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <IconPencil className="size-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="size-8 text-destructive hover:text-destructive">
                                            <IconTrash className="size-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
