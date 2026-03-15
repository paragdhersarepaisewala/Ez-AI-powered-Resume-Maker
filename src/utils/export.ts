import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { domToPng } from "modern-screenshot";
import { jsPDF } from "jspdf";
import { ResumeData } from "../types";

export async function exportToPDF(elementId: string, fileName: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // Temporarily remove scaling for capture
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
    
    // Restore original style
    element.style.transform = originalStyle;
    element.style.transformOrigin = originalOrigin;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // A4 is 210mm x 297mm
    pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error("PDF Export failed:", error);
    alert("PDF Export failed. Please try again.");
  }
}

export async function exportToWord(data: ResumeData, fileName: string) {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: data.personalInfo.fullName,
                bold: true,
                size: 32,
                color: "2563eb", // indigo-600
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `${data.personalInfo.designation} | ${data.personalInfo.email} | ${data.personalInfo.contactNo}`,
                size: 20,
                color: "64748b", // slate-500
              }),
            ],
          }),
          
          // Summary
          new Paragraph({
            text: "PROFESSIONAL SUMMARY",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "e2e8f0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            text: data.aiContent.summary,
            spacing: { after: 200 },
          }),

          // Experience
          new Paragraph({
            text: "WORK EXPERIENCE",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "e2e8f0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 400, after: 100 },
          }),
          ...data.aiContent.experience.flatMap((exp) => [
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: exp.position, bold: true, size: 24 }),
                new TextRun({ text: ` at ${exp.company}`, italics: true, size: 24, color: "475569" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${exp.startDate} - ${exp.endDate}`, size: 18, color: "94a3b8" }),
              ],
            }),
            new Paragraph({ 
              text: exp.description,
              spacing: { after: 100 },
            }),
          ]),

          // Education
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "e2e8f0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 400, after: 100 },
          }),
          ...data.aiContent.education.flatMap((edu) => [
            new Paragraph({
              spacing: { before: 100 },
              children: [
                new TextRun({ text: edu.degree, bold: true, size: 24 }),
                new TextRun({ text: ` from ${edu.institution}`, italics: true, size: 24, color: "475569" }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: `${edu.startDate} - ${edu.endDate}`, size: 18, color: "94a3b8" }),
              ],
            }),
            new Paragraph({ 
              text: edu.description,
              spacing: { after: 100 },
            }),
          ]),

          // Skills
          new Paragraph({
            text: "SKILLS & PROFICIENCIES",
            heading: HeadingLevel.HEADING_2,
            border: { bottom: { color: "e2e8f0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 400, after: 100 },
          }),
          new Paragraph({
            text: data.aiContent.skills.map(s => `${s.name} (${['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'][s.level - 1]})`).join(", "),
            spacing: { after: 200 },
          }),

          // Custom Sections
          ...data.aiContent.customSections.flatMap((section) => [
            new Paragraph({
              text: section.title.toUpperCase(),
              heading: HeadingLevel.HEADING_2,
              border: { bottom: { color: "e2e8f0", space: 1, style: BorderStyle.SINGLE, size: 6 } },
              spacing: { before: 400, after: 100 },
            }),
            new Paragraph({
              text: section.content,
              spacing: { after: 200 },
            }),
          ]),
        ],
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
