import React from "react";
import { Maximize2 } from "lucide-react";

type ImagePreviewButtonProps = {
  label: string;
  className: string;
  onClick: () => void;
};

export function ImagePreviewButton({ label, className, onClick }: ImagePreviewButtonProps) {
  return <button type="button" className={className} onClick={onClick}><Maximize2 size={14} /> {label}</button>;
}
