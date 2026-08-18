import React from "react";
import { Download } from "lucide-react";
import { CircuitPdfReport, downloadCircuitPdfReport } from "@/lib/circuitPdfReport";

type CircuitPdfReportActionProps = {
  report: CircuitPdfReport | null;
};

export function CircuitPdfReportAction({ report }: CircuitPdfReportActionProps) {
  if (!report) return null;

  return (
    <div className="report-actions">
      <button type="button" onClick={() => downloadCircuitPdfReport(report)}>
        <Download size={15} />
        <span>DOWNLOAD PDF REPORT</span>
        <small>{report.imageDataUrl ? "ORIGINAL IMAGE EMBEDDED" : "TEXT ANALYSIS / NO IMAGE ATTACHED"}</small>
      </button>
      <p className="mono">PDF EXPORT / FINDINGS + CONFIDENCE + UNCERTAINTY</p>
    </div>
  );
}
