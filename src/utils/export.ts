import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, UnderlineType } from "docx";
import { domToPng } from "modern-screenshot";
import { jsPDF } from "jspdf";
import { ResumeData } from "../types";

export async function exportToPDF(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const originalStyle = element.style.transform;
    const originalOrigin = element.style.transformOrigin;
    element.style.transform = "none";
    element.style.transformOrigin = "top left";

    const dataUrl = await domToPng(element, {
      scale: 3,
      backgroundColor: "#ffffff",
      quality: 1,
      width: 794,
      height: 1123,
    });

    element.style.transform = originalStyle;
    element.style.transformOrigin = originalOrigin;

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF Export failed:", error);
    alert("PDF Export failed. Please try again.");
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sectionHeading = (text: string) =>
  new Paragraph({
    spacing: { before: 320, after: 80 },
    border: { bottom: { color: "000000", space: 1, style: BorderStyle.SINGLE, size: 8 } },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 24,         // 12pt
        font: "Calibri",
      }),
    ],
  });

const contactLine = (parts: string[]) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 160 },
    children: parts
      .filter(Boolean)
      .flatMap((p, i, arr) => [
        new TextRun({ text: p, size: 20, font: "Calibri" }),
        ...(i < arr.length - 1 ? [new TextRun({ text: "  |  ", size: 20, color: "888888", font: "Calibri" })] : []),
      ]),
  });

// ─── Main Export ──────────────────────────────────────────────────────────────

export async function exportToWord(data: ResumeData, fileName: string) {
  const { personalInfo: pi, aiContent: ai } = data;

  const children: Paragraph[] = [];

  // ── Name ──
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [new TextRun({ text: pi.fullName || "Your Name", bold: true, size: 44, font: "Calibri" })],
    })
  );

  // ── Designation ──
  if (pi.designation) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [new TextRun({ text: pi.designation, size: 24, color: "444444", font: "Calibri", italics: true })],
      })
    );
  }

  // ── Contact line ──
  children.push(contactLine([pi.email, pi.contactNo, pi.address].filter(Boolean)));

  // ── Summary ──
  if (ai.summary?.trim()) {
    children.push(sectionHeading("Professional Summary"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: ai.summary, size: 20, font: "Calibri" })],
      })
    );
  }

  // ── Skills (keyword list — ATS style) ──
  if (ai.skills.length > 0) {
    children.push(sectionHeading("Core Competencies & Skills"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: ai.skills.map((s) => s.name).join("  •  "),
            size: 20,
            font: "Calibri",
          }),
        ],
      })
    );
  }

  // ── Experience ──
  if (ai.experience.length > 0) {
    children.push(sectionHeading("Professional Experience"));
    for (const exp of ai.experience) {
      // Position | Company
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 0 },
          children: [
            new TextRun({ text: exp.position, bold: true, size: 22, font: "Calibri" }),
            exp.company ? new TextRun({ text: `  —  ${exp.company}`, size: 22, italics: true, color: "555555", font: "Calibri" }) : new TextRun(""),
          ],
        })
      );
      // Date range
      if (exp.startDate || exp.endDate) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: [exp.startDate, exp.endDate].filter(Boolean).join(" – "), size: 18, color: "888888", font: "Calibri" })],
          })
        );
      }
      // Description
      if (exp.description?.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: exp.description, size: 20, font: "Calibri" })],
          })
        );
      }
    }
  }

  // ── Education ──
  if (ai.education.length > 0) {
    children.push(sectionHeading("Education"));
    for (const edu of ai.education) {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 0 },
          children: [
            new TextRun({ text: edu.degree, bold: true, size: 22, font: "Calibri" }),
            edu.institution ? new TextRun({ text: `  —  ${edu.institution}`, size: 22, italics: true, color: "555555", font: "Calibri" }) : new TextRun(""),
          ],
        })
      );
      if (edu.startDate || edu.endDate) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: [edu.startDate, edu.endDate].filter(Boolean).join(" – "), size: 18, color: "888888", font: "Calibri" })],
          })
        );
      }
      if (edu.description?.trim()) {
        children.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: edu.description, size: 20, font: "Calibri" })],
          })
        );
      }
    }
  }

  // ── Goals ──
  if (ai.goals?.trim()) {
    children.push(sectionHeading("Career Objective"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: ai.goals, size: 20, font: "Calibri" })],
      })
    );
  }

  // ── Hobbies ──
  if (ai.hobbies.length > 0) {
    children.push(sectionHeading("Interests"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: ai.hobbies.join("  •  "), size: 20, font: "Calibri" })],
      })
    );
  }

  // ── Custom Sections ──
  for (const section of ai.customSections ?? []) {
    if (!section.title && !section.content) continue;
    children.push(sectionHeading(section.title || "Section"));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: section.content, size: 20, font: "Calibri" })],
      })
    );
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Calibri", size: 20 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } }, // ~1.25cm margins
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.docx`;
  link.click();
  URL.revokeObjectURL(url);
}
