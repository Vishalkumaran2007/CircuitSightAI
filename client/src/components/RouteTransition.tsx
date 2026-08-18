import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import { useLocation } from "wouter";

export function getRouteTransitionLabel(pathname: string) {
  if (pathname.startsWith("/workspace")) return "OPENING ANALYSIS WORKSPACE";
  if (pathname.startsWith("/dashboard")) return "LOADING SIGNAL DASHBOARD";
  if (pathname.startsWith("/learning")) return "SYNCING LEARNING LOOP";
  if (pathname.startsWith("/auth")) return "SECURING SIGN-IN GATE";
  return "ROUTING TO CIRCUITSIGHT";
}

function getInitialTransition(location: string) {
  if (typeof window === "undefined" || !window.location) return { visible: false, label: getRouteTransitionLabel(location) };
  const transition = new URLSearchParams(window.location.search).get("transition");
  return { visible: Boolean(transition), label: getRouteTransitionLabel(transition || location) };
}

export default function RouteTransition() {
  const [location] = useLocation();
  const previousLocation = useRef(location);
  const initialTransition = getInitialTransition(location);
  const [visible, setVisible] = useState(initialTransition.visible);
  const [label, setLabel] = useState(initialTransition.label);

  useEffect(() => {
    if (previousLocation.current === location) return;
    previousLocation.current = location;
    setLabel(getRouteTransitionLabel(location));
    setVisible(true);
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setVisible(false), reducedMotion ? 140 : 430);
    return () => window.clearTimeout(timer);
  }, [location]);

  if (!visible) return null;

  return (
    <div className="route-transition" role="status" aria-live="polite" aria-label={label}>
      <div className="route-transition-grid" aria-hidden="true" />
      <div className="route-transition-content">
        <div className="route-transition-mark"><span /><span /><span /></div>
        <p className="mono">SIGNAL GATE / 00{location === "/" ? "1" : "2"}</p>
        <strong>{label}</strong>
        <div className="route-transition-progress" aria-hidden="true"><span /></div>
        <div className="route-transition-footer"><LoaderCircle size={14} className="route-transition-spinner" /><span className="mono">HANDSHAKE IN PROGRESS</span><ArrowUpRight size={14} /></div>
      </div>
    </div>
  );
}
