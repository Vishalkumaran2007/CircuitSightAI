/* Kinetic Circuit Brutalism: AI-workspace shell, asymmetric rail, upload-ready composer, explicit confidence language. */
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowUpRight, FileImage, Loader2, LogOut, Menu, Paperclip, Plus, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

type WorkspaceMessage = { id: number; role: "user" | "assistant"; content: string; attachment?: string };

const suggestions = ["Why is my LED not lighting?", "Check this breadboard wiring", "Explain resistor polarity"];

export default function Workspace() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) setLocation("/auth");
  }, [loading, setLocation, user]);

  const submitQuestion = (prompt = draft) => {
    const trimmed = prompt.trim();
    if ((!trimmed && !file) || isAnalyzing) return;
    const attachment = file?.name;
    setMessages((current) => [...current, { id: Date.now(), role: "user", content: trimmed || "Analyze this circuit image.", attachment }]);
    setDraft("");
    setFile(null);
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", content: "I can help trace this. I’ll inspect the visible components, signal path, polarity, and ground connections before suggesting a correction.\n\nThis workspace is ready for multimodal analysis. Upload a clear top-down circuit image or add more detail to your doubt so the finding can be scored with confidence." }]);
      setIsAnalyzing(false);
    }, 1100);
  };

  if (loading) return <main className="dashboard-page dashboard-loading"><div className="dashboard-loader"><Loader2 className="spin" size={30} /><span className="mono">VERIFYING SESSION / WORKSPACE</span><strong>OPENING<br /><em>THE LAB.</em></strong></div></main>;
  if (!user) return null;

  return (
    <main className="workspace-page">
      <aside className={`workspace-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="workspace-sidebar-head"><Link href="/dashboard" className="brand"><span className="workspace-mark">C</span><span>CIRCUITSIGHT <i>AI</i></span></Link><button className="workspace-close" onClick={() => setSidebarOpen(false)} aria-label="Close workspace menu"><X size={18} /></button></div>
        <button className="new-analysis" onClick={() => { setMessages([]); setFile(null); setDraft(""); setSidebarOpen(false); }}><Plus size={16} /> NEW ANALYSIS <span className="mono">⌘ N</span></button>
        <div className="workspace-nav-label mono">RECENT THREADS</div>
        <div className="thread-list"><button className="thread active"><span className="thread-status" /> New circuit analysis <small>JUST NOW</small></button><button className="thread"><span className="thread-status muted" /> LED polarity check <small>DEMO</small></button><button className="thread"><span className="thread-status muted" /> Breadboard ground path <small>DEMO</small></button></div>
        <div className="workspace-sidebar-foot"><div className="workspace-account"><div className="account-avatar">{(user.name || "U").charAt(0).toUpperCase()}</div><div><strong>{user.name || "LAB USER"}</strong><small>{user.email || "ACTIVE SESSION"}</small></div></div><button className="workspace-logout" onClick={() => logout()} aria-label="Sign out"><LogOut size={15} /></button></div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-topbar"><button className="workspace-menu" onClick={() => setSidebarOpen(true)} aria-label="Open workspace menu"><Menu size={19} /></button><div><span className="mono">CIRCUITSIGHT / ANALYSIS</span><strong>NEW CIRCUIT THREAD</strong></div><div className="workspace-top-status"><span className="live-dot" /> VISION READY</div></header>
        <section className={`workspace-conversation ${messages.length === 0 ? "empty" : ""}`}>
          {messages.length === 0 ? <div className="workspace-empty"><div className="workspace-empty-mark"><Sparkles size={28} /></div><span className="mono">INPUT FIELD / 01</span><h1>WHAT ARE YOU<br /><em>BUILDING?</em></h1><p>Type a circuit doubt or upload a photo. CircuitSight will help you see the signal, trace the fault, and understand the fix.</p><div className="suggestion-grid">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => submitQuestion(suggestion)}>{suggestion}<ArrowUpRight size={14} /></button>)}</div></div> : <div className="message-stream">{messages.map((message) => <div key={message.id} className={`workspace-message ${message.role}`}><div className="message-meta mono">{message.role === "user" ? "YOU / INPUT" : "CIRCUITSIGHT / VISION"}</div><div className="message-content">{message.content.split("\n").map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}{message.attachment && <div className="message-attachment"><FileImage size={16} /><span>{message.attachment}</span><small>IMAGE ATTACHED</small></div>}</div></div>)}{isAnalyzing && <div className="workspace-message assistant analyzing"><div className="message-meta mono">CIRCUITSIGHT / VISION</div><div className="analyzing-line"><span className="analyzing-pulse" /><span>READING COMPONENTS AND VISIBLE CONNECTIONS</span><Loader2 className="spin" size={15} /></div></div>}</div>}
        </section>
        <section className="workspace-composer-wrap"><div className="workspace-confidence mono">ANALYSIS IS PROBABILISTIC / CONFIDENCE WILL BE SHOWN WITH EVERY FINDING</div><form className="workspace-composer" onSubmit={(event) => { event.preventDefault(); submitQuestion(); }}><div className="composer-tools"><button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Upload circuit image"><Paperclip size={18} /></button><input ref={fileInputRef} type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /></div><textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Describe your circuit or ask a doubt..." rows={1} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitQuestion(); } }} /><button className="composer-send" type="submit" disabled={isAnalyzing || (!draft.trim() && !file)} aria-label="Send circuit question"><Send size={18} /></button></form>{file && <div className="composer-file"><FileImage size={15} /><span>{file.name}</span><button type="button" onClick={() => setFile(null)} aria-label="Remove attachment"><X size={14} /></button></div>}<div className="workspace-composer-note">CIRCUITSIGHT CAN MAKE MISTAKES. VERIFY POWER, POLARITY, AND CONTINUITY BEFORE ENERGIZING A CIRCUIT.</div></section>
      </div>
    </main>
  );
}
