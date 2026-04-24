import { Card } from "@repo/ui/components/ui/card";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Input } from "@repo/ui/components/ui/input";
import { Button } from "@repo/ui/components/ui/button";
import { IconSend, IconUser, IconRobot } from "@tabler/icons-react";

export default function InboxPage() {
    return (
        <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)] gap-4">
            {/* Conversation List Sidebar */}
            <Card className="w-full md:w-80 flex flex-col overflow-hidden">
                <div className="p-4 border-b font-medium">Conversations</div>
                <div className="flex-1 overflow-y-auto">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`p-4 border-b cursor-pointer hover:bg-muted/50 flex flex-col gap-2 ${i === 1 ? "bg-muted/50" : ""}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Avatar className="size-8">
                                        <AvatarFallback>C{i}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">Customer {i}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">12:30 PM</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground truncate pr-4">
                                    I need help with my order...
                                </p>
                                {i === 1 ? (
                                    <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-blue-500 text-blue-500">Human Active</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-[10px] h-4 px-1 py-0">Bot Active</Badge>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                            <AvatarFallback>C1</AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-medium text-sm">Customer 1</div>
                            <div className="text-xs text-muted-foreground">PSID: 1234567890</div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <IconRobot className="size-4 mr-2" />
                            Hand Back to Bot
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-muted/20">
                    <div className="flex flex-col gap-1 items-start">
                        <div className="bg-muted px-4 py-2 rounded-2xl rounded-tl-none max-w-[80%] text-sm">
                            Hi, I need help with my order status.
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-1">12:28 PM</span>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                            Hello! I'd be happy to help. Can you please provide your order ID?
                        </div>
                        <span className="text-[10px] text-muted-foreground mr-1 flex items-center gap-1">
                            <IconRobot className="size-3" />
                            Bot • 12:29 PM
                        </span>
                    </div>

                    <div className="flex justify-center my-2">
                        <Badge variant="secondary" className="text-xs font-normal">
                            Agent took over conversation
                        </Badge>
                    </div>
                    
                    <div className="flex flex-col gap-1 items-end">
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[80%] text-sm">
                            Hi there, human agent here. I'm looking into this for you right now.
                        </div>
                        <span className="text-[10px] text-muted-foreground mr-1 flex items-center gap-1">
                            <IconUser className="size-3" />
                            You • 12:30 PM
                        </span>
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t flex gap-2">
                    <Input placeholder="Type your message as a human agent..." className="flex-1" />
                    <Button>
                        <IconSend className="size-4 mr-2" />
                        Send
                    </Button>
                </div>
            </Card>
        </div>
    );
}
