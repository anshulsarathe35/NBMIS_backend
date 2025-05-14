// utils/pdfGenerator.js
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Generate PDF for Sales Report
exports.generateSalesPDF = async (sales) => {
  const doc = new PDFDocument({ margin: 30 });
  
  doc.fontSize(18).text('Sales Report', { align: 'center' });
  doc.moveDown();

  // Table Header
  doc.fontSize(12).text('District  |  Date  |  Amount', { underline: true });

  sales.forEach(sale => {
    doc.text(`${sale.district}  |  ${sale.date}  |  ${sale.amount}`);
  });

  doc.end();
  
  return new Promise((resolve, reject) => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
};

// Generate PDF for Receipts Report
exports.generateReceiptsPDF = async (receipts) => {
  const doc = new PDFDocument({ margin: 30 });

  doc.fontSize(18).text('Receipts Report', { align: 'center' });
  doc.moveDown();

  // Table Header
  doc.fontSize(12).text('District  |  Date  |  Cash  |  Bank  |  Online  |  Total', { underline: true });

  receipts.forEach(receipt => {
    const total = receipt.cash + receipt.bank + receipt.online;
    doc.text(`${receipt.district}  |  ${receipt.date}  |  ${receipt.cash}  |  ${receipt.bank}  |  ${receipt.online}  |  ${total}`);
  });

  doc.end();
  
  return new Promise((resolve, reject) => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
};
