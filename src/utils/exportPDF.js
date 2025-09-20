import jsPDF from 'jspdf';

const exportPDF = (template) => {
  const doc = new jsPDF();
  const page_width = doc.internal.pageSize.width;
  const margin = 14;

  // Logo
  const img = new Image();
  img.src = '/assets/elsipogtoglogo.png';
  doc.addImage(img, 'PNG', margin, 10, 30, 20);

  // Header
  doc.setFillColor(25, 118, 210); // Blue color
  doc.rect(0, 0, page_width, 40, 'F');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(template.name, page_width / 2, 25, { align: 'center' });

  // Description
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  const descriptionLines = doc.splitTextToSize(template.description || '', page_width - (margin * 2));
  doc.text(descriptionLines, margin, 60);

  const descriptionHeight = doc.getTextDimensions(descriptionLines).h;
  let y = 60 + descriptionHeight + 10; // Start custom fields below description

  // Custom Fields
  template.customFields.forEach((field) => {
    if (y > doc.internal.pageSize.height - 30) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(12);
    doc.setTextColor(25, 118, 210);
    doc.text(`${field.name}:`, margin, y);

    doc.setTextColor(0, 0, 0);
    const valueLines = doc.splitTextToSize(field.value || '', page_width - margin - 50); // 50 is where value starts
    doc.text(valueLines, 50, y);
    const valueHeight = doc.getTextDimensions(valueLines).h;
    y += valueHeight + 5;
  });

  // Footer
  const finePrint = `Created on ${template.createdAt} by ${template.createdBy}`;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(finePrint, margin, doc.internal.pageSize.height - 10);

  doc.save(`${template.name}.pdf`);
};

export default exportPDF;
