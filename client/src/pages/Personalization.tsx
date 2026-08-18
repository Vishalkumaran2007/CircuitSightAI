import React, { useEffect, useState } from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { trpc } from "@/lib/trpc";
import { Check, Loader2, Save } from "lucide-react";

type Preferences = {
  explanationLevel: "beginner" | "intermediate" | "advanced";
  responseStyle: "concise" | "balanced" | "detailed";
  sarcasmEnabled: boolean;
  technicalTerminology: boolean;
  preferVisuals: boolean;
  suggestImprovements: boolean;
};

const defaults: Preferences = { explanationLevel: "intermediate", responseStyle: "balanced", sarcasmEnabled: false, technicalTerminology: true, preferVisuals: true, suggestImprovements: true };

export default function Personalization() {
  const { data, isLoading } = trpc.preferences.get.useQuery();
  const utils = trpc.useUtils();
  const update = trpc.preferences.update.useMutation({ onSuccess: () => utils.preferences.get.invalidate() });
  const [form, setForm] = useState<Preferences>(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (data) setForm({ explanationLevel: data.explanationLevel, responseStyle: data.responseStyle, sarcasmEnabled: data.sarcasmEnabled, technicalTerminology: data.technicalTerminology, preferVisuals: data.preferVisuals, suggestImprovements: data.suggestImprovements }); }, [data]);
  const setField = <K extends keyof Preferences>(key: K, value: Preferences[K]) => { setSaved(false); setForm(current => ({ ...current, [key]: value })); };
  const save = async () => { await update.mutateAsync(form); setSaved(true); };

  return <AccountPageFrame kicker="IDK / PERSONALIZATION" title={<>TUNE<br /><em>THE KERNEL.</em></>} description="Shape how IDK explains, asks, and recommends. These preferences are saved to your account and applied to future circuit analyses.">
    <div className="preference-layout">
      <section className="preference-panel"><div className="panel-kicker mono">01 / EXPLANATION DEPTH</div><h2>HOW MUCH SIGNAL?</h2><p>Choose the level of technical detail IDK should use when explaining a diagnosis.</p><div className="segmented-control" role="radiogroup" aria-label="Explanation level">{(["beginner", "intermediate", "advanced"] as const).map(level => <button key={level} type="button" role="radio" aria-checked={form.explanationLevel === level} onClick={() => setField("explanationLevel", level)}>{level.toUpperCase()}</button>)}</div></section>
      <section className="preference-panel"><div className="panel-kicker mono">02 / RESPONSE SHAPE</div><h2>HOW SHOULD IDK TALK?</h2><p>Concise keeps the readout tight. Detailed opens the reasoning trail.</p><div className="segmented-control" role="radiogroup" aria-label="Response style">{(["concise", "balanced", "detailed"] as const).map(style => <button key={style} type="button" role="radio" aria-checked={form.responseStyle === style} onClick={() => setField("responseStyle", style)}>{style.toUpperCase()}</button>)}</div></section>
      <section className="preference-panel preference-panel-wide"><div className="panel-kicker mono">03 / INTERACTION SIGNALS</div><h2>CONTROL THE BEHAVIOR.</h2><div className="preference-checks">
        <label><input type="checkbox" checked={form.technicalTerminology} onChange={event => setField("technicalTerminology", event.target.checked)} /><span><strong>TECHNICAL TERMINOLOGY</strong><small>Allow terms such as MOSFET region, impedance, and biasing when useful.</small></span></label>
        <label><input type="checkbox" checked={form.preferVisuals} onChange={event => setField("preferVisuals", event.target.checked)} /><span><strong>PREFER VISUAL EXPLANATIONS</strong><small>Ask IDK to favor visual guidance when the evidence supports it.</small></span></label>
        <label><input type="checkbox" checked={form.suggestImprovements} onChange={event => setField("suggestImprovements", event.target.checked)} /><span><strong>SUGGEST CIRCUIT IMPROVEMENTS</strong><small>Include practical improvement ideas without presenting them as verified fixes.</small></span></label>
        <label><input type="checkbox" checked={form.sarcasmEnabled} onChange={event => setField("sarcasmEnabled", event.target.checked)} /><span><strong>ALLOW SUBTLE SARCASM</strong><small>Keep technical accuracy first; humor remains optional and restrained.</small></span></label>
      </div></section>
      <div className="preference-actions"><button className="button button-acid button-large" type="button" onClick={save} disabled={isLoading || update.isPending}>{update.isPending ? <Loader2 className="spin" size={16} /> : saved ? <Check size={16} /> : <Save size={16} />}{update.isPending ? "SAVING" : saved ? "SAVED" : "SAVE PREFERENCES"}</button></div>
    </div>
  </AccountPageFrame>;
}
