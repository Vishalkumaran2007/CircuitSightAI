import React, { useEffect, useRef, useState } from "react";
import { CircleHelp, LogOut, Palette, Settings, UserRound, UsersRound } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

type AccountMenuProps = {
  compact?: boolean;
};

export default function AccountMenu({ compact = false }: AccountMenuProps) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("account") === "menu");
  const menuRef = useRef<HTMLDivElement>(null);
  const displayName = user?.name || "LAB USER";
  const email = user?.email || "SIGNED-IN ACCOUNT";
  const initial = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={menuRef} className={`account-menu ${compact ? "account-menu-compact" : ""}`}>
      <button type="button" className="workspace-account account-menu-trigger" onClick={() => setOpen(current => !current)} aria-expanded={open} aria-haspopup="menu" aria-label="Open account menu">
        <span className="account-avatar">{initial}</span>
        <span className="account-menu-identity"><strong>{displayName}</strong><small>{email}</small></span>
      </button>
      {open && (
        <div className="account-popover" role="menu" aria-label="IDK account menu">
          <div className="account-popover-head"><span className="mono">IDK / ACCOUNT</span><strong>{displayName}</strong></div>
          <nav className="account-popover-nav">
            <Link href="/personalization" role="menuitem" onClick={() => setOpen(false)}><Palette size={14} /> PERSONALIZATION</Link>
            <Link href="/profile" role="menuitem" onClick={() => setOpen(false)}><UserRound size={14} /> PROFILE</Link>
            <Link href="/settings" role="menuitem" onClick={() => setOpen(false)}><Settings size={14} /> SETTINGS</Link>
            <div className="account-menu-divider" />
            <Link href="/help" role="menuitem" onClick={() => setOpen(false)}><CircleHelp size={14} /> HELP</Link>
            <div className="account-menu-divider" />
            <Link href="/switch-account" role="menuitem" onClick={() => setOpen(false)}><UsersRound size={14} /> SWITCH ACCOUNT</Link>
            <button type="button" role="menuitem" onClick={() => logout()}><LogOut size={14} /> LOG OUT</button>
          </nav>
        </div>
      )}
    </div>
  );
}
