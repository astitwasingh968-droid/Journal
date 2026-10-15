import jsPDF from "jspdf";

export function exportJournalPDF(entries) {
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text("Digital Journal Entries", 20, 10);

  entries.forEach((entry, index) => {
    const lines = doc.splitTextToSize(entry.text, 170);

    doc.setFontSize(12);
    doc.text(`Date: ${entry.date}`, 20, y);
    y += 8;

    doc.text(`Mood: ${entry.mood || ""}`, 20, y);
    y += 8;

    doc.text(`Sentiment: ${entry.sentiment || ""}`, 20, y);
    y += 8;

    doc.text(lines, 20, y);
    y += lines.length * 7;

    y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("journal_entries.pdf");
}