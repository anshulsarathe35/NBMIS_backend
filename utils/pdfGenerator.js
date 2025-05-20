// // utils/pdfGenerator.js
// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// // Generate PDF for Sales Report
// exports.generateSalesPDF = async (sales) => {
//   const doc = new PDFDocument({ margin: 30 });
  
//   doc.fontSize(18).text('Sales Report', { align: 'center' });
//   doc.moveDown();

//   // Table Header
//   doc.fontSize(12).text('District  |  Date  |  Amount', { underline: true });

//   sales.forEach(sale => {
//     doc.text(`${sale.district}  |  ${sale.date}  |  ${sale.amount}`);
//   });

//   doc.end();
  
//   return new Promise((resolve, reject) => {
//     const buffers = [];
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', reject);
//   });
// };

// // Generate PDF for Receipts Report
// exports.generateReceiptsPDF = async (receipts) => {
//   const doc = new PDFDocument({ margin: 30 });

//   doc.fontSize(18).text('Receipts Report', { align: 'center' });
//   doc.moveDown();

//   // Table Header
//   doc.fontSize(12).text('District  |  Date  |  Cash  |  Bank  |  Online  |  Total', { underline: true });

//   receipts.forEach(receipt => {
//     const total = receipt.cash + receipt.bank + receipt.online;
//     doc.text(`${receipt.district}  |  ${receipt.date}  |  ${receipt.cash}  |  ${receipt.bank}  |  ${receipt.online}  |  ${total}`);
//   });

//   doc.end();
  
//   return new Promise((resolve, reject) => {
//     const buffers = [];
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', reject);
//   });
// };


// exports.generateDistrictwiseSalesPDF = async (sales) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 30 });
//     const buffers = [];

//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', reject);

//     doc.fontSize(18).text('District-wise Sales and Receipts Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Period: ${sales[0]?.date || ''}`);
//     doc.moveDown();

//     // Table Header
//     doc.fontSize(12);
//     doc.text('District', 50, doc.y, { continued: true });
//     doc.text('Sale', 200, doc.y, { continued: true });
//     doc.text('Receipt', 300, doc.y);
//     doc.moveDown();

//     // Table Rows
//     sales.forEach(item => {
//       doc.text(item.district, 50, doc.y, { continued: true });
//       doc.text(item.amount, 200, doc.y, { continued: true });
//       doc.text(item.receipt, 300, doc.y);
//     });

//     doc.end();
//   });
// };

const PDFDocument = require('pdfkit');

const PAGE_HEIGHT = 720; // Leave space for margins and headers
const LINE_HEIGHT = 20;

// Utility to handle pagination
function ensureSpace(doc) {
  if (doc.y > PAGE_HEIGHT) {
    doc.addPage();
  }
}

// Date-wise Sales PDF
exports.generateSalesPDF = async (sales) => {
  const doc = new PDFDocument({ margin: 30 });
  doc.fontSize(18).text('Sales Report', { align: 'center' }).moveDown();
  doc.fontSize(12).text('District  |  Date  |  Amount', { underline: true });

  sales.forEach(sale => {
    ensureSpace(doc);
    doc.text(`${sale.district}  |  ${sale.date}  |  ₹${sale.amount}`);
  }); 

  doc.end();
  return new Promise((resolve, reject) => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
};

// Date-wise Receipts PDF
exports.generateReceiptsPDF = async (receipts) => {
  const doc = new PDFDocument({ margin: 30 });
  doc.fontSize(18).text('Receipts Report', { align: 'center' }).moveDown();
  doc.fontSize(12).text('District  |  Date  |  Cash  |  Bank  |  Online  |  Total', { underline: true });

  receipts.forEach(receipt => {
    const total = receipt.cash + receipt.bank + receipt.online;
    ensureSpace(doc);
    doc.text(`${receipt.district}  |  ${receipt.date}  |  ₹${receipt.cash}  |  ₹${receipt.bank}  |  ₹${receipt.online}  |  ₹${total}`);
  });

  doc.end();
  return new Promise((resolve, reject) => {
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);
  });
};


// exports.generateDistrictwiseSalesOnlyPDF = (salesByDistrict) => {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument({ margin: 40, size: 'A4' });
//     const buffers = [];

//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', reject);

//     // Title
//     doc.fontSize(16).font('Helvetica-Bold').text('District-wise Sales Report', { align: 'center' });
//     doc.moveDown(1.5);

//     // Define column widths (in pixels)
//     const columnPositions = {
//       district: 50,
//       cash: 220,
//       private: 300,
//       gov: 380,
//       total: 460,
//     };

//     // Draw table header
//     doc.fontSize(12).font('Helvetica-Bold');
//     doc.text('District', columnPositions.district, doc.y);
//     doc.text('Cash', columnPositions.cash, doc.y);
//     doc.text('Private', columnPositions.private, doc.y);
//     doc.text('Gov', columnPositions.gov, doc.y);
//     doc.text('Total', columnPositions.total, doc.y);
//     doc.moveDown(0.5);
//     doc.font('Helvetica');

//     // Draw horizontal line
//     doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
//     doc.moveDown(0.5);

//     let grandCash = 0, grandPrivate = 0, grandGov = 0, grandTotal = 0;

//     for (const [district, data] of Object.entries(salesByDistrict)) {
//       const cash = data.cash || 0;
//       const priv = data.private || 0;
//       const gov = data.gov || 0;
//       const total = cash + priv + gov;

//       grandCash += cash;
//       grandPrivate += priv;
//       grandGov += gov;
//       grandTotal += total;

//       doc.text(district, columnPositions.district, doc.y);
//       doc.text(cash.toFixed(2), columnPositions.cash, doc.y, { width: 70, align: 'right' });
//       doc.text(priv.toFixed(2), columnPositions.private, doc.y, { width: 70, align: 'right' });
//       doc.text(gov.toFixed(2), columnPositions.gov, doc.y, { width: 70, align: 'right' });
//       doc.text(total.toFixed(2), columnPositions.total, doc.y, { width: 70, align: 'right' });

//       doc.moveDown();

//       // Add a new page if space is low
//       if (doc.y > doc.page.height - 50) {
//         doc.addPage();
//       }
//     }

//     // Draw horizontal line before grand total
//     doc.moveDown(0.5);
//     doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
//     doc.moveDown(0.5);

//     // Grand Total Row
//     doc.font('Helvetica-Bold');
//     doc.text('Grand Total', columnPositions.district, doc.y);
//     doc.text(grandCash.toFixed(2), columnPositions.cash, doc.y, { width: 70, align: 'right' });
//     doc.text(grandPrivate.toFixed(2), columnPositions.private, doc.y, { width: 70, align: 'right' });
//     doc.text(grandGov.toFixed(2), columnPositions.gov, doc.y, { width: 70, align: 'right' });
//     doc.text(grandTotal.toFixed(2), columnPositions.total, doc.y, { width: 70, align: 'right' });

//     doc.end();
//   });
// };

exports.generateDistrictwiseSalesOnlyPDF = (salesByDistrict) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Title
    doc.fontSize(16).font('Helvetica-Bold').text('District-wise Sales Report', { align: 'center' });
    doc.moveDown(1.5);

    // Define column positions and widths
    const columnPositions = {
      district: 50,
      cash: 220,
      private: 300,
      gov: 380,
      total: 460,
    };
    const columnWidths = {
      district: 160,
      cash: 70,
      private: 70,
      gov: 70,
      total: 70,
    };

    // Starting y position for the table header
    let y = doc.y;

    // Draw table header text
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('District', columnPositions.district, y);
    doc.text('Cash', columnPositions.cash, y, { width: columnWidths.cash, align: 'right' });
    doc.text('Private', columnPositions.private, y, { width: columnWidths.private, align: 'right' });
    doc.text('Gov', columnPositions.gov, y, { width: columnWidths.gov, align: 'right' });
    doc.text('Total', columnPositions.total, y, { width: columnWidths.total, align: 'right' });

    // Draw horizontal line below header
    y += 20;
    doc.moveTo(columnPositions.district, y).lineTo(columnPositions.total + columnWidths.total, y).stroke();

    doc.font('Helvetica');
    y += 5;

    let grandCash = 0, grandPrivate = 0, grandGov = 0, grandTotal = 0;

    for (const [district, data] of Object.entries(salesByDistrict)) {
      const cash = data.cash || 0;
      const priv = data.private || 0;
      const gov = data.gov || 0;
      const total = cash + priv + gov;

      grandCash += cash;
      grandPrivate += priv;
      grandGov += gov;
      grandTotal += total;

      // Check for page break
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 40;

        // Repeat header on new page
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('District', columnPositions.district, y);
        doc.text('Cash', columnPositions.cash, y, { width: columnWidths.cash, align: 'right' });
        doc.text('Private', columnPositions.private, y, { width: columnWidths.private, align: 'right' });
        doc.text('Gov', columnPositions.gov, y, { width: columnWidths.gov, align: 'right' });
        doc.text('Total', columnPositions.total, y, { width: columnWidths.total, align: 'right' });
        y += 20;
        doc.moveTo(columnPositions.district, y).lineTo(columnPositions.total + columnWidths.total, y).stroke();
        doc.font('Helvetica');
        y += 5;
      }

      // Draw row text
      doc.text(district, columnPositions.district, y);
      doc.text(cash.toFixed(2), columnPositions.cash, y, { width: columnWidths.cash, align: 'right' });
      doc.text(priv.toFixed(2), columnPositions.private, y, { width: columnWidths.private, align: 'right' });
      doc.text(gov.toFixed(2), columnPositions.gov, y, { width: columnWidths.gov, align: 'right' });
      doc.text(total.toFixed(2), columnPositions.total, y, { width: columnWidths.total, align: 'right' });

      // Draw horizontal line below the row
      y += 20;
      doc.moveTo(columnPositions.district, y).lineTo(columnPositions.total + columnWidths.total, y).stroke();

      // Draw vertical lines for this row
      const xPositions = [
        columnPositions.district,
        columnPositions.cash,
        columnPositions.private,
        columnPositions.gov,
        columnPositions.total,
        columnPositions.total + columnWidths.total,
      ];

      for (let xIdx = 0; xIdx < xPositions.length; xIdx++) {
        doc.moveTo(xPositions[xIdx], y - 20).lineTo(xPositions[xIdx], y).stroke();
      }
    }

    // Grand total row
    doc.font('Helvetica-Bold');
    doc.text('Grand Total', columnPositions.district, y);
    doc.text(grandCash.toFixed(2), columnPositions.cash, y, { width: columnWidths.cash, align: 'right' });
    doc.text(grandPrivate.toFixed(2), columnPositions.private, y, { width: columnWidths.private, align: 'right' });
    doc.text(grandGov.toFixed(2), columnPositions.gov, y, { width: columnWidths.gov, align: 'right' });
    doc.text(grandTotal.toFixed(2), columnPositions.total, y, { width: columnWidths.total, align: 'right' });

    y += 20;

    // Draw horizontal line below grand total
    doc.moveTo(columnPositions.district, y).lineTo(columnPositions.total + columnWidths.total, y).stroke();

    // Draw vertical lines for the grand total row
    const xPositions = [
      columnPositions.district,
      columnPositions.cash,
      columnPositions.private,
      columnPositions.gov,
      columnPositions.total,
      columnPositions.total + columnWidths.total,
    ];

    for (let xIdx = 0; xIdx < xPositions.length; xIdx++) {
      doc.moveTo(xPositions[xIdx], y - 20).lineTo(xPositions[xIdx], y).stroke();
    }

    doc.end();
  });
};

// District-wise Receipts PDF (No Date)
// exports.generateDistrictwiseReceiptsOnlyPDF = async (districtReceiptsMap) => {
//   const doc = new PDFDocument({ margin: 30 });
//   const buffers = [];

//   doc.on('data', buffers.push.bind(buffers));
//   doc.on('end', () => resolve(Buffer.concat(buffers)));
//   doc.on('error', reject);

//   doc.fontSize(18).text('District-wise Receipts Report', { align: 'center' }).moveDown();
//   doc.fontSize(12).text('District  |  Cash  |  Online  |  Bank  |  Total', { underline: true });

//   Object.entries(districtReceiptsMap).forEach(([district, { cash, online, bank }]) => {
//     const total = cash + online + bank;
//     ensureSpace(doc);
//     doc.text(`${district}  |  ₹${cash}  |  ₹${online}  |  ₹${bank}  |  ₹${total}`);
//   });

//   doc.end();
//   return new Promise((resolve, reject) => {
//     doc.on('data', buffers.push.bind(buffers));
//     doc.on('end', () => resolve(Buffer.concat(buffers)));
//     doc.on('error', reject);
//   });
exports.generateDistrictwiseReceiptsOnlyPDF = async (districtReceiptsMap, branch, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Header
    doc.fontSize(18).font('Helvetica-Bold').text('District-wise Receipts Report', { align: 'center' });
    doc.moveDown(0.5);

    // Metadata: Branch and Dates
    doc.fontSize(12).font('Helvetica');
    doc.text(`Branch: ${branch}`);
    doc.text(`Start Date: ${startDate}`);
    doc.text(`End Date: ${endDate}`);
    doc.moveDown(1);

    // Table Header
    const tableTop = doc.y;
    const colX = {
      district: 40,
      cash: 200,
      online: 280,
      bank: 360,
      total: 440
    };

    const rowHeight = 20;

    doc.rect(colX.district - 5, tableTop, 470, rowHeight).stroke();

    doc.font('Helvetica-Bold').fontSize(12);
    doc.text('District', colX.district, tableTop + 5, { width: 120 });
    doc.text('Cash', colX.cash, tableTop + 5, { width: 60, align: 'right' });
    doc.text('Online', colX.online, tableTop + 5, { width: 60, align: 'right' });
    doc.text('Bank', colX.bank, tableTop + 5, { width: 60, align: 'right' });
    doc.text('Total', colX.total, tableTop + 5, { width: 60, align: 'right' });

    // Table Rows
    doc.font('Helvetica').fontSize(11);
    let y = tableTop + rowHeight;

    Object.entries(districtReceiptsMap).forEach(([district, { cash, online, bank }]) => {
      const total = cash + online + bank;

      // Row border
      doc.rect(colX.district - 5, y, 470, rowHeight).stroke();

      // Row content
      doc.text(district, colX.district, y + 5, { width: 120 });
      doc.text(cash.toFixed(2), colX.cash, y + 5, { width: 60, align: 'right' });
      doc.text(online.toFixed(2), colX.online, y + 5, { width: 60, align: 'right' });
      doc.text(bank.toFixed(2), colX.bank, y + 5, { width: 60, align: 'right' });
      doc.text(total.toFixed(2), colX.total, y + 5, { width: 60, align: 'right' });

      y += rowHeight;

      // Add new page if needed
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 40;
      }
    });

    doc.end();
  });

};
