import { jsPDF } from "jspdf";

export type CircuitReportFinding = {
  label: string;
  status: string;
  confidence: number;
  detail: string;
};

export type CircuitReportAnalysis = {
  summary: string;
  diagnosis: string;
  confidence: number;
  findings: CircuitReportFinding[];
  recommendedSteps: string[];
  uncertaintyNotice: string;
};

export type CircuitPdfReport = {
  analysis: CircuitReportAnalysis;
  imageDataUrl?: string | null;
  imageMimeType?: string | null;
  title: string;
  generatedAt?: Date;
};

export function getPdfImageFormat(imageMimeType?: string | null): "PNG" | "JPEG" {
  return imageMimeType?.toLowerCase().includes("png") ? "PNG" : "JPEG";
}

export function buildCircuitReportContent(report: CircuitPdfReport): string[] {
  return [
    "CIRCUITSIGHT AI / CORRECTION REPORT",
    report.title,
    report.analysis.summary,
    report.analysis.diagnosis,
    `OVERALL CONFIDENCE / ${report.analysis.confidence}%`,
    ...report.analysis.findings.map(finding => `${finding.label} / ${finding.status.toUpperCase()} / ${finding.confidence}% / ${finding.detail}`),
    ...report.analysis.recommendedSteps.map((step, index) => `CHECK ${index + 1} / ${step}`),
    `UNCERTAINTY NOTICE / ${report.analysis.uncertaintyNotice}`,
    report.imageDataUrl ? "ORIGINAL CIRCUIT IMAGE / EMBEDDED" : "ORIGINAL CIRCUIT IMAGE / NOT AVAILABLE",
  ];
}

export function createCircuitPdfReport(report: CircuitPdfReport): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = 18;

  const addWrapped = (text: string, size: number, color: [number, number, number], gap = 6) => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * (size * 0.42) + gap;
  };

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      doc.setFillColor(9, 9, 11);
      doc.rect(0, 0, pageWidth, pageHeight, "F");
      y = 18;
    }
  };

  doc.setFillColor(9, 9, 11);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFont("helvetica", "bold");
  addWrapped("CIRCUITSIGHT AI / CORRECTION REPORT", 10, [223, 225, 4], 4);
  addWrapped(report.title.toUpperCase(), 22, [250, 250, 250], 5);
  addWrapped(`GENERATED / ${(report.generatedAt ?? new Date()).toLocaleString()}`, 8, [161, 161, 170], 8);
  doc.setDrawColor(63, 63, 70);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  if (report.imageDataUrl) {
    ensureSpace(70);
    addWrapped("ORIGINAL CIRCUIT IMAGE", 9, [223, 225, 4], 4);
    const imageWidth = pageWidth - margin * 2;
    const imageHeight = Math.min(72, imageWidth * 0.62);
    doc.addImage(report.imageDataUrl, getPdfImageFormat(report.imageMimeType), margin, y, imageWidth, imageHeight, undefined, "FAST");
    y += imageHeight + 9;
  }

  addWrapped("SUMMARY", 9, [223, 225, 4], 3);
  addWrapped(report.analysis.summary, 11, [250, 250, 250], 6);
  addWrapped("DIAGNOSIS", 9, [223, 225, 4], 3);
  addWrapped(report.analysis.diagnosis, 11, [212, 212, 216], 6);
  addWrapped(`OVERALL CONFIDENCE / ${report.analysis.confidence}%`, 11, [223, 225, 4], 8);

  addWrapped("FINDINGS", 9, [223, 225, 4], 3);
  report.analysis.findings.forEach(finding => {
    ensureSpace(18);
    addWrapped(`${finding.label} / ${finding.status.toUpperCase()} / ${finding.confidence}%`, 10, [250, 250, 250], 2);
    addWrapped(finding.detail, 9, [161, 161, 170], 5);
  });

  ensureSpace(35);
  addWrapped("RECOMMENDED CHECKS", 9, [223, 225, 4], 3);
  report.analysis.recommendedSteps.forEach((step, index) => addWrapped(`${index + 1}. ${step}`, 10, [212, 212, 216], 3));
  ensureSpace(28);
  addWrapped("UNCERTAINTY NOTICE", 9, [245, 184, 61], 3);
  addWrapped(report.analysis.uncertaintyNotice, 10, [245, 184, 61], 8);
  addWrapped("Do not treat uncertain findings as confirmed electrical facts. Verify power, polarity, and continuity before energizing a circuit.", 9, [161, 161, 170], 4);

  return doc;
}

export function downloadCircuitPdfReport(report: CircuitPdfReport) {
  const doc = createCircuitPdfReport(report);
  doc.save("circuitsight-correction-report.pdf");
}
