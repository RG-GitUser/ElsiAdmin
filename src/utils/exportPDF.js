import jsPDF from 'jspdf';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const exportPDF = async (template) => {
  try {
    const pdfDoc = new jsPDF();
    const page_width = pdfDoc.internal.pageSize.width;
    const margin = 14;

    const db = getFirestore();

    let creatorName = "Unknown";
    if (template.owner) {
      const userDocRef = doc(db, "users", template.owner);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        creatorName = userDoc.data().name || "Unknown";
      }
    } else if (template.createdBy) {
        creatorName = template.createdBy;
    }

    let creationDate = "Unknown";
    if (template.createdAt && template.createdAt.toDate) {
        creationDate = template.createdAt.toDate().toLocaleDateString();
    } else if (template.createdAt) {
        creationDate = new Date(template.createdAt).toLocaleDateString();
    }

    // Logo
    const img = new Image();
    img.src = '/elsipogtoglogo.png';
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    pdfDoc.addImage(img, 'PNG', margin, 10, 30, 20);

    // Header
    pdfDoc.setFillColor(25, 118, 210); // Blue color
    pdfDoc.rect(0, 0, page_width, 40, 'F');
    pdfDoc.setFontSize(22);
    pdfDoc.setTextColor(255, 255, 255);
    pdfDoc.text(template.name, page_width / 2, 25, { align: 'center' });

    // Description
    pdfDoc.setFontSize(12);
    pdfDoc.setTextColor(0, 0, 0);
    const descriptionLines = pdfDoc.splitTextToSize(template.description || '', page_width - (margin * 2));
    pdfDoc.text(descriptionLines, margin, 60);

    const descriptionHeight = pdfDoc.getTextDimensions(descriptionLines).h;
    let y = 60 + descriptionHeight + 10; // Start custom fields below description

    // Custom Fields
    if (template.customFields) {
        template.customFields.forEach((field) => {
            if (y > pdfDoc.internal.pageSize.height - 30) {
            pdfDoc.addPage();
            y = 20;
            }
            pdfDoc.setFontSize(12);
            pdfDoc.setTextColor(25, 118, 210);
            pdfDoc.text(`${field.name}:`, margin, y);

            pdfDoc.setTextColor(0, 0, 0);
            const valueLines = pdfDoc.splitTextToSize(field.value || '', page_width - margin - 50); // 50 is where value starts
            pdfDoc.text(valueLines, 50, y);
            const valueHeight = pdfDoc.getTextDimensions(valueLines).h;
            y += valueHeight + 5;
        });
    }

    // Footer
    const finePrint = `Created on ${creationDate} by ${creatorName}`;
    pdfDoc.setFontSize(8);
    pdfDoc.setTextColor(150, 150, 150);
    pdfDoc.text(finePrint, margin, pdfDoc.internal.pageSize.height - 10);

    pdfDoc.save(`${template.name || 'document'}.pdf`);
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("Could not export PDF. See console for details.");
  }
};

export default exportPDF;
