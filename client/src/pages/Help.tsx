import React, { lazy, Suspense, useState } from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import type { Message } from "@/components/AIChatBox";
const HelpChatBox = lazy(() => import("@/components/AIChatBox").then(module => ({ default: module.AIChatBox })));
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, BookOpen, MessageCircleQuestion } from "lucide-react";
import { Link } from "wouter";

const examples = ["How do I upload a circuit?", "Where are saved analyses?", "How do I change IDK’s explanation level?", "What does Visual Signal change?"];

export default function Help() {
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: "I’m IDK Support. Ask me how to use the website, manage your account, tune the kernel, choose a Visual Signal palette, or export a correction report. For circuit diagnosis, open the Workspace instead." }]);
  const chat = trpc.help.chat.useMutation({
    onSuccess: ({ content }) => setMessages(current => [...current, { role: "assistant", content }]),
    onError: error => setMessages(current => [...current, { role: "assistant", content: `SUPPORT LINK INTERRUPTED. ${error.message}` }]),
  });
  const handleSend = (content: string) => {
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    const helpMessages = next.filter((message): message is Message & { role: "user" | "assistant" } => message.role !== "system");
    chat.mutate({ messages: helpMessages.slice(-12) });
  };

  return <AccountPageFrame kicker="IDK / HELP & SUPPORT" title={<>TRACE<br /><em>THE ANSWER.</em></>} description="Website guidance stays separate from circuit diagnosis. Ask how the product works here; upload evidence and ask electronics questions in the Workspace.">
    <div className="help-grid">
      <section className="help-card help-card-acid"><BookOpen size={22} /><span className="mono">01 / HOW TO USE IDK</span><h2>THE DIAGNOSTIC LOOP.</h2><ol><li>Upload a clear circuit image or schematic in Workspace.</li><li>Ask IDK what you want to know.</li><li>Review evidence, findings, confidence, and uncertainty.</li><li>Correct IDK when a visible detail was misunderstood.</li><li>Continue in the same thread and export a correction report when analysis completes.</li></ol></section>
      <section className="help-card"><MessageCircleQuestion size={22} /><span className="mono">02 / WEBSITE SUPPORT</span><h2>ASK ABOUT THE PRODUCT.</h2><Suspense fallback={<div className="help-chat-loading mono">INITIALIZING SUPPORT CHANNEL...</div>}><HelpChatBox messages={messages} onSendMessage={handleSend} isLoading={chat.isPending} height={"430px"} placeholder="Ask how IDK works..." emptyStateMessage="Website support is ready." suggestedPrompts={examples} /></Suspense></section>
      <section className="help-card help-card-wide"><span className="mono">03 / EVIDENCE & SAFETY</span><h2>IDK DOES NOT GUESS.</h2><p>IDK separates visible observations from inferences. Every finding carries confidence and an evidence state. Perspective, glare, occlusion, and missing labels can make continuity impossible to verify. Treat uncertain findings as inspection leads, keep power disconnected while checking a questionable circuit, and verify polarity, continuity, and component ratings before energizing.</p><Link className="button button-outline" href="/workspace">OPEN THE WORKSPACE <ArrowUpRight size={15} /></Link></section>
    </div>
  </AccountPageFrame>;
}
