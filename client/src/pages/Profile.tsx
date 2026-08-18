import React from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { useAuth } from "@/_core/hooks/useAuth";
import { CalendarDays, Mail, ShieldCheck, UserRound } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const name = user?.name || "LAB USER";
  return <AccountPageFrame kicker="IDK / PROFILE" title={<>YOUR<br /><em>SIGNAL.</em></>} description="Your account identity and session metadata. Authentication secrets are never displayed here.">
    <div className="profile-grid">
      <section className="profile-identity"><div className="profile-avatar">{name.charAt(0).toUpperCase()}</div><div><span className="mono">AUTHENTICATED USER</span><h2>{name}</h2><p>{user?.email || "No email available"}</p></div></section>
      <section className="profile-data"><div className="profile-data-row"><UserRound size={18} /><span><small>DISPLAY NAME</small><strong>{name}</strong></span></div><div className="profile-data-row"><Mail size={18} /><span><small>EMAIL</small><strong>{user?.email || "NOT PROVIDED"}</strong></span></div><div className="profile-data-row"><CalendarDays size={18} /><span><small>ACCOUNT CREATED</small><strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "AVAILABLE TO SESSION"}</strong></span></div><div className="profile-data-row"><ShieldCheck size={18} /><span><small>AUTHENTICATION</small><strong>SECURE OAUTH SESSION</strong></span></div></section>
      <section className="profile-note"><span className="mono">PROFILE EDITING / 01</span><p>Your current authentication provider supplies the identity fields shown above. Editable profile fields are not enabled because this account does not expose a safe profile-edit endpoint.</p></section>
    </div>
  </AccountPageFrame>;
}
