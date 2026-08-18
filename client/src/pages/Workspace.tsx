import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, FileImage, Loader2, LogOut, Menu, Paperclip, Plus, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";

type WorkspaceMessage = { id: number | string; role: "user" | "assistant"; content: string; attachmentName?: string | null };

const suggestions = ["Why is my LED not lighting?", "Check this breadboard wiring", "Explain resistor polarity"];
const sampleCircuitMessages: WorkspaceMessage[] = [
  { id: "sample-user", role: "user", content: "Sample circuit: Why does the LED stay off on this breadboard?", attachmentName: "sample-breadboard.jpg" },
  { id: "sample-assistant", role: "assistant", content: "SAMPLE CIRCUIT DEMO — NOT SAVED TO YOUR HISTORY\n\nA typical LED issue is reversed polarity, a missing current-limiting resistor, or a ground rail that is not bridged across the board.\n\nCONFIDENCE / EXAMPLE ONLY\n\nRECOMMENDED CHECKS\n1. Confirm the LED’s longer lead connects toward the resistor or positive supply.\n2. Trace the ground rail end-to-end with power disconnected.\n3. Confirm a resistor is in series with the LED before energizing the circuit.\n\nUNCERTAINTY NOTICE\nThis is a teaching sample, not an analysis of your own circuit." },
];

export default function Workspace() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzeMutation = trpc.circuit.analyze.useMutation();
  const { data: threads = [], refetch: refetchThreads, isLoading: isThreadsLoading } = trpc.circuit.listThreads.useQuery(undefined, { enabled: Boolean(user) });
  const threadQuery = trpc.circuit.getThread.useQuery({ threadId: activeThreadId ?? 0 }, { enabled: activeThreadId !== null });

  useEffect(() => {
    if (!loading && (!user || !user.emailVerified)) setLocation("/auth");
  }, [loading, setLocation, user]);

  useEffect(() => {
    if (threadQuery.data) {
      setMessages(threadQuery.data.messages.map(message => ({ id: message.id, role: message.role, content: message.content, attachmentName: message.attachmentName })));
      setIsDemo(false);
    }
  }, [threadQuery.data]);

  const newAnalysis = () => {
    setMessages([]); setFile(null); setDraft(""); setActiveThreadId(null); setIsDemo(false); setSidebarOpen(false);
  };

  const openThread = (threadId: number) => {
    setActiveThreadId(threadId); setIsDemo(false); setSidebarOpen(false);
  };

  const openSampleDemo = () => {
    setMessages(sampleCircuitMessages); setActiveThreadId(null); setIsDemo(true); setSidebarOpen(false);
  };

  const submitQuestion = async (prompt = draft) => {
    const trimmed = prompt.trim();
    if ((!trimmed && !file) || analyzeMutation.isPending) return;
    const selectedFile = file;
    const attachmentName = selectedFile?.name;
    const userContent = trimmed || "Analyze this circuit image.";
    const temporaryId = `pending-${Date.now()}`;
    setMessages(current => [...(isDemo ? [] : current), { id: temporaryId, role: "user", content: userContent, attachmentName }]);
    setIsDemo(false); setDraft(""); setFile(null);

    try {
      let imageDataUrl: string | undefined;
      if (selectedFile) {
        if (selectedFile.size > 8 * 1024 * 1024) throw new Error("Please choose an image smaller than 8 MB.");
        imageDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("The circuit image could not be read."));
          reader.readAsDataURL(selectedFile);
        });
      }
      const result = await analyzeMutation.mutateAsync({ threadId: activeThreadId ?? undefined, question: trimmed || undefined, imageDataUrl, imageMimeType: selectedFile?.type, attachmentName });
      setActiveThreadId(result.thread.id);
      setMessages(current => [...current.filter(message => message.id !== temporaryId), { id: `user-${Date.now()}`, role: "user", content: userContent, attachmentName }, { id: `assistant-${Date.now()}`, role: "assistant", content: result.displayContent }]);
      await refetchThreads();
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "The live analysis could not be completed.";
      setMessages(current => [...current.filter(entry => entry.id !== temporaryId), { id: `error-${Date.now()}`, role: "assistant", content: `ANALYSIS INTERRUPTED\n\n${message}\n\nTry a clearer circuit photo or ask the question again. No electrical conclusion was made.` }]);
    }
  };

  if (loading) return <main className="dashboard-page dashboard-loading"><div className="dashboard-loader"><Loader2 className="spin" size={30} /><span className="mono">VERIFYING SESSION / WORKSPACE</span><strong>OPENING<br /><em>THE LAB.</em></strong></div></main>;
  if (!user || !user.emailVerified) return null;

  return (
    <main className="workspace-page">
      <aside className={`workspace-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="workspace-sidebar-head"><Link href="/dashboard" className="brand"><span className="workspace-mark">C</span><span>CIRCUITSIGHT <i>AI</i></span></Link><button className="workspace-close" onClick={() => setSidebarOpen(false)} aria-label="Close workspace menu"><X size={18} /></button></div>
        <button className="new-analysis" onClick={newAnalysis}><Plus size={16} /> NEW ANALYSIS <span className="mono">⌘ N</span></button>
        <div className="workspace-nav-label mono">YOUR ANALYSES</div>
        <div className="thread-list">{isThreadsLoading ? <span className="thread-empty mono">LOADING YOUR HISTORY…</span> : threads.length ? threads.map(thread => <button key={thread.id} className={`thread ${thread.id === activeThreadId ? "active" : ""}`} onClick={() => openThread(thread.id)}><span className="thread-status" /> {thread.title}<small>{new Date(thread.updatedAt).toLocaleDateString()}</small></button>) : <span className="thread-empty mono">NO SAVED ANALYSES YET</span>}</div>
        <div className="workspace-sample"><span className="mono">LEARNING SAMPLE / NOT SAVED</span><button type="button" onClick={openSampleDemo}>OPEN SAMPLE CIRCUIT <ArrowUpRight size={13} /></button></div>
        <div className="workspace-sidebar-foot"><div className="workspace-account"><div className="account-avatar">{(user.name || "U").charAt(0).toUpperCase()}</div><div><strong>{user.name || "LAB USER"}</strong><small>{user.email || "VERIFIED EMAIL"}</small></div></div><button className="workspace-logout" onClick={() => logout()} aria-label="Sign out"><LogOut size={15} /></button></div>
      </aside>
      <div className="workspace-main">
        <header className="workspace-topbar"><button className="workspace-menu" onClick={() => setSidebarOpen(true)} aria-label="Open workspace menu"><Menu size={19} /></button><div><span className="mono">CIRCUITSIGHT / ANALYSIS</span><strong>{isDemo ? "SAMPLE CIRCUIT DEMO" : activeThreadId ? "SAVED CIRCUIT THREAD" : "NEW CIRCUIT THREAD"}</strong></div><div className="workspace-top-status"><span className="live-dot" /> VISION READY</div></header>
        <section className={`workspace-conversation ${messages.length === 0 ? "empty" : ""}`}>
          {messages.length === 0 ? <div className="workspace-empty"><div className="workspace-empty-mark"><Sparkles size={28} /></div><span className="mono">INPUT FIELD / 01</span><h1>WHAT ARE YOU<br /><em>BUILDING?</em></h1><p>Ask a circuit question or upload a clear circuit photo. Your verified account keeps only the analyses you submit.</p><div className="suggestion-grid">{suggestions.map(suggestion => <button key={suggestion} onClick={() => submitQuestion(suggestion)}>{suggestion}<ArrowUpRight size={14} /></button>)}</div><button className="sample-demo-launch" onClick={openSampleDemo}>VIEW SAMPLE CIRCUIT DEMO <ArrowUpRight size={14} /></button></div> : <div className="message-stream">{isDemo && <div className="sample-demo-banner mono">SAMPLE CIRCUIT DEMO / NOT SAVED TO YOUR ACCOUNT</div>}{messages.map(message => <div key={message.id} className={`workspace-message ${message.role}`}><div className="message-meta mono">{message.role === "user" ? "YOU / INPUT" : "CIRCUITSIGHT / VISION"}</div><div className="message-content">{message.content.split("\n").map((line, index) => <p key={index}>{line || <>&nbsp;</>}</p>)}{message.attachmentName && <div className="message-attachment"><FileImage size={16} /><span>{message.attachmentName}</span><small>{isDemo ? "SAMPLE IMAGE" : "YOUR IMAGE"}</small></div>}</div></div>)}{analyzeMutation.isPending && <div className="workspace-message assistant analyzing"><div className="message-meta mono">CIRCUITSIGHT / VISION</div><div className="analyzing-line"><span className="analyzing-pulse" /><span>READING COMPONENTS AND VISIBLE CONNECTIONS</span><Loader2 className="spin" size={15} /></div></div>}</div>}
        </section>
        <section className="workspace-composer-wrap"><div className="workspace-confidence mono">ANALYSIS IS PROBABILISTIC / CONFIDENCE WILL BE SHOWN WITH EVERY FINDING</div><form className="workspace-composer" onSubmit={event => { event.preventDefault(); submitQuestion(); }}><div className="composer-tools"><button type="button" onClick={() => fileInputRef.current?.click()} aria-label="Upload circuit image"><Paperclip size={18} /></button><input ref={fileInputRef} type="file" accept="image/*" onChange={event => setFile(event.target.files?.[0] || null)} /></div><textarea value={draft} onChange={event => setDraft(event.target.value)} placeholder="Describe a circuit or ask a doubt..." aria-label="Describe your circuit or ask a doubt" rows={1} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitQuestion(); } }} /><button className="composer-send" type="submit" disabled={analyzeMutation.isPending || (!draft.trim() && !file)} aria-label="Send circuit question"><Send size={18} /></button></form>{file && <div className="composer-file"><FileImage size={15} /><span>{file.name}</span><button type="button" onClick={() => setFile(null)} aria-label="Remove attachment"><X size={14} /></button></div>}<div className="workspace-composer-note">CIRCUITSIGHT CAN MAKE MISTAKES. VERIFY POWER, POLARITY, AND CONTINUITY BEFORE ENERGIZING A CIRCUIT.</div></section>
      </div>
    </main>
  );
}
