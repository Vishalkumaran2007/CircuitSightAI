import React from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { ArrowUpRight, BookOpen, MessageCircleQuestion } from "lucide-react";
import { Link } from "wouter";

const examples = ["Check this circuit.", "Find the fault.", "Why isn't my LED working?", "Trace the current path.", "Explain this circuit.", "Show me the corrected circuit."];

export default function Help() {
  return <AccountPageFrame kicker="IDK / HELP & SUPPORT" title={<>TRACE<br /><em>THE ANSWER.</em></>} description="A short operating guide for working with IDK. Upload evidence, ask a focused question, correct misunderstandings, and keep the lesson moving.">
    <div className="help-grid">
      <section className="help-card help-card-acid"><BookOpen size={22} /><span className="mono">01 / HOW TO USE IDK</span><h2>THE DIAGNOSTIC LOOP.</h2><ol><li>Upload a clear circuit image or schematic.</li><li>Ask IDK what you want to know.</li><li>Review detected components, connections, diagnosis, and confidence.</li><li>Correct IDK if something was misunderstood.</li><li>Continue the conversation in the same thread.</li><li>Ask for annotated or corrected visual guidance when available.</li></ol></section>
      <section className="help-card"><MessageCircleQuestion size={22} /><span className="mono">02 / EXAMPLE QUESTIONS</span><h2>ASK BETTER QUESTIONS.</h2><div className="help-examples">{examples.map(example => <button type="button" key={example} onClick={() => undefined}>{example}<ArrowUpRight size={14} /></button>)}</div></section>
      <section className="help-card help-card-wide"><span className="mono">03 / EVIDENCE & SAFETY</span><h2>IDK DOES NOT GUESS.</h2><p>IDK separates visible observations from inferences. Every finding carries confidence and an evidence state. Perspective, glare, occlusion, and missing labels can make continuity impossible to verify. Treat uncertain findings as inspection leads, keep power disconnected while checking a questionable circuit, and verify polarity, continuity, and component ratings before energizing.</p><Link className="button button-outline" href="/workspace">OPEN THE WORKSPACE <ArrowUpRight size={15} /></Link></section>
    </div>
  </AccountPageFrame>;
}
