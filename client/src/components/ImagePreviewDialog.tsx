import React, { useEffect } from "react";
import { Maximize2, X } from "lucide-react";

type ImagePreviewDialogProps = {
  src: string | null;
  alt: string;
  open: boolean;
  onClose: () => void;
};

export function ImagePreviewDialog({ src, alt, open, onClose }: ImagePreviewDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open]);

  if (!open || !src) return null;

  return (
    <div className="image-preview-overlay" role="dialog" aria-modal="true" aria-label={`Preview of ${alt}`} onMouseDown={event => { if (event.currentTarget === event.target) onClose(); }}>
      <div className="image-preview-dialog">
        <div className="image-preview-head">
          <span className="mono"><Maximize2 size={13} /> IMAGE PREVIEW / {alt}</span>
          <button type="button" className="image-preview-close" onClick={onClose} aria-label="Close image preview"><X size={18} /></button>
        </div>
        <div className="image-preview-canvas"><img src={src} alt={alt} /></div>
        <p className="image-preview-note mono">ESC TO CLOSE / VERIFY VISUAL DETAILS BEFORE ANALYSIS</p>
      </div>
    </div>
  );
}
