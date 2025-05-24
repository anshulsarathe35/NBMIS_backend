const Sale = require('../models/Sale');
const Receipt = require('../models/Receipt');
const District = require("../models/District")
const PDFDocument = require('pdfkit');

// Fetch sales and receipts data by branch
// exports.getBranchReports = async (req, res) => {
//   try {
//     const { branches } = req.body;

//     const sales = await Promise.all(branches.map(async (branch) => {
//       const saleList = await Sale.find({ branch });
//       const totalSales = saleList.reduce((sum, s) => sum + s.amount, 0);
//       return { branch, totalSales };
//     }));

//     const receipts = await Promise.all(branches.map(async (branch) => {
//       const receiptList = await Receipt.find({ branch });
//       const totalReceipts = receiptList.reduce((sum, r) => sum + r.cash + r.online + r.bank, 0);
//       return { branch, totalReceipts };
//     }));

//     res.json({ sales, receipts });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// };
// exports.getBranchReports = async (req, res) => {
//   const { branches, fromDate, toDate } = req.body;

//   const start = new Date(fromDate);
//   const end = new Date(toDate);
//   end.setHours(23, 59, 59, 999); // include full day

//   const results = {};

//   for (const branch of branches) {
//     const saleRows = await Sale.aggregate([
//       { $match: { branch, date: { $gte: start, $lte: end } } },
//       { $group: { _id: '$district', total: { $sum: '$amount' } } }
//     ]);

//     const receiptRows = await Receipt.aggregate([
//       { $match: { branch, date: { $gte: start, $lte: end } } },
//       {
//         $group: {
//           _id: '$district',
//           cash: { $sum: '$cash' },
//           private: { $sum: '$online' },
//           gov: { $sum: '$bank' },
//         }
//       }
//     ]);

//     const formatSaleRows = saleRows.map(row => ({
//       district: row._id,
//       cash: 0,
//       private: 0,
//       gov: 0,
//       total: row.total
//     }));

//     const formatReceiptRows = receiptRows.map(row => ({
//       district: row._id,
//       cash: row.cash,
//       private: row.private,
//       gov: row.gov,
//       total: row.cash + row.private + row.gov
//     }));

//     results[branch] = {
//       sales: {
//         rows: formatSaleRows,
//         grandTotal: formatSaleRows.reduce((sum, r) => sum + r.total, 0)
//       },
//       receipts: {
//         rows: formatReceiptRows,
//         grandTotal: formatReceiptRows.reduce((sum, r) => sum + r.total, 0)
//       }
//     };
//   }

//   res.json(results);
// };

exports.getBranchReports = async (req, res) => {
  const { branches, fromDate, toDate } = req.body;

  try {
    const results = {};

    for (const branch of branches) {
      // SALES aggregation
      const saleRows = await Sale.aggregate([
        {
          $match: {
            branch,
            date: { $gte: fromDate, $lte: toDate } // string comparison works
          }
        },
        {
          $group: {
            _id: '$district',
            cash: { $sum: '$cash' },
            private: { $sum: '$private' },
            gov: { $sum: '$gov' }
          }
        }
      ]);

      const formatSaleRows = saleRows.map(row => ({
        district: row._id,
        cash: row.cash,
        private: row.private,
        gov: row.gov,
        total: row.cash + row.private + row.gov
      }));

      const salesGrandTotal = formatSaleRows.reduce((sum, r) => sum + r.total, 0);

      // RECEIPTS aggregation
      const receiptRows = await Receipt.aggregate([
        {
          $match: {
            branch,
            date: { $gte: fromDate, $lte: toDate }
          }
        },
        {
          $group: {
            _id: '$district',
            cash: { $sum: '$cash' },
            private: { $sum: '$private' },
            gov: { $sum: '$gov' }
          }
        }
      ]);

      const formatReceiptRows = receiptRows.map(row => ({
        district: row._id,
        cash: row.cash,
        private: row.private,
        gov: row.gov,
        total: row.cash + row.private + row.gov
      }));

      const receiptsGrandTotal = formatReceiptRows.reduce((sum, r) => sum + r.total, 0);

      results[branch] = {
        sales: {
          rows: formatSaleRows,
          grandTotal: salesGrandTotal
        },
        receipts: {
          rows: formatReceiptRows,
          grandTotal: receiptsGrandTotal
        }
      };
    }

    res.json(results);
  } catch (error) {
    console.error('Branch report error:', error);
    res.status(500).json({ error: 'Server error while generating branch reports.' });
  }
};

// Download Sales PDF
// exports.downloadSalesPDF = async (req, res) => {
//   try {
//     const { branches } = req.body;
//     const sales = await Promise.all(branches.map(async (branch) => {
//       const saleList = await Sale.find({ branch });
//       const totalSales = saleList.reduce((sum, s) => sum + s.amount, 0);
//       return { branch, totalSales };
//     }));

//     const doc = new PDFDocument();
//     res.setHeader('Content-Disposition', 'attachment; filename=sales_report.pdf');
//     res.setHeader('Content-Type', 'application/pdf');
//     doc.pipe(res);

//     doc.fontSize(18).text('Sales Report', { align: 'center' }).moveDown();
//     sales.forEach(({ branch, totalSales }) => {
//       doc.fontSize(14).text(`Branch: ${branch}`);
//       doc.text(`Total Sales: ${totalSales}`);
//       doc.moveDown();
//     });

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('PDF generation error');
//   }
// };

// exports.downloadSalesPDF = async (req, res) => {
//   try {
//     const { branches, fromDate, toDate } = req.body;
//     const from = fromDate;
//     const to = toDate;

//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     const chunks = [];
//     doc.on("data", chunk => chunks.push(chunk));
//     doc.on("end", () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
//       res.send(pdfBuffer);
//     });

//     doc.fontSize(16).font("Helvetica-Bold").text("Branch-wise Sales Report", { align: "center" });
//     doc.moveDown();

//     for (const branch of branches) {
//       const allDistricts = await District.find({ branch }).lean();
//       const districtMap = new Map(allDistricts.map(d => [d.name, d]));
//       const sales = await Sale.find({ date: { $gte: from, $lte: to } }).lean();
//       const filteredSales = sales.filter(s => districtMap.has(s.district));

//       const districtWiseTotals = {};
//       let grandTotals = { cash: 0, private: 0, gov: 0, total: 0 };

//       filteredSales.forEach(sale => {
//         const districtName = sale.district;
//         if (!districtWiseTotals[districtName]) {
//           districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
//         }

//         const amt = Math.ceil(sale.amount || 0);
//         if (sale.category === "cash") {
//           districtWiseTotals[districtName].cash += amt;
//           grandTotals.cash += amt;
//         } else if (sale.category === "private") {
//           districtWiseTotals[districtName].private += amt;
//           grandTotals.private += amt;
//         } else if (sale.category === "gov") {
//           districtWiseTotals[districtName].gov += amt;
//           grandTotals.gov += amt;
//         }

//         districtWiseTotals[districtName].total += amt;
//         grandTotals.total += amt;
//       });

//       console.log("Filtered Sales:", filteredSales);
//     //   console.log("All districts:", sales);


//       doc.addPage();
//       doc.fontSize(14).font("Helvetica-Bold").text(`Branch: ${branch}`);
//       doc.moveDown();

//       const colWidths = [150, 80, 80, 80, 80];
//       const headers = ["District", "Cash", "Private", "Gov", "Total"];
//       const startX = doc.x;
//       let y = doc.y;
//       const rowHeight = 20;

//       const drawRow = (values, isHeader = false) => {
//         let x = startX;
//         values.forEach((val, idx) => {
//           doc.rect(x, y, colWidths[idx], rowHeight).stroke();
//           doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
//              .fontSize(11)
//              .text(val, x + 5, y + 5, { width: colWidths[idx] - 10, align: idx === 0 ? 'left' : 'right' });
//           x += colWidths[idx];
//         });
//         y += rowHeight;
//         if (y > doc.page.height - 50) {
//           doc.addPage();
//           y = 40;
//         }
//       };

//       drawRow(headers, true);

//       Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//         drawRow([
//           district,
//           Math.ceil(totals.cash),
//           Math.ceil(totals.private),
//           Math.ceil(totals.gov),
//           Math.ceil(totals.total)
//         ]);
//       });

//       drawRow([
//         "Grand Total",
//         Math.ceil(grandTotals.cash),
//         Math.ceil(grandTotals.private),
//         Math.ceil(grandTotals.gov),
//         Math.ceil(grandTotals.total)
//       ], true);
//     }

//     doc.end();
//   } catch (error) {
//     console.error("Error generating sales PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// };
// exports.downloadSalesPDF = async (req, res) => {
//   try {
//     const { branches, fromDate, toDate } = req.body;

//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     to.setHours(23, 59, 59, 999); // Include entire end date

//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     const chunks = [];
//     doc.on("data", chunk => chunks.push(chunk));
//     doc.on("end", () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
//       res.send(pdfBuffer);
//     });

//     doc.fontSize(16).font("Helvetica-Bold").text("Branch-wise Sales Report", { align: "center" });
//     doc.moveDown();

//     for (const branch of branches) {
//       const allDistricts = await District.find({ branch }).lean();
//       const districtMap = new Map(allDistricts.map(d => [d.name, d]));

//       const sales = await Sale.find({ date: { $gte: fromDate, $lte: toDate } }).lean();
//       const filteredSales = sales.filter(s => districtMap.has(s.district));

//       const districtWiseTotals = {};
//       let grandTotals = { cash: 0, private: 0, gov: 0, total: 0 };

//       filteredSales.forEach(sale => {
//         const districtName = sale.district;
//         if (!districtWiseTotals[districtName]) {
//           districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
//         }

//         const cash = Math.ceil(sale.cash || 0);
//         const privateAmt = Math.ceil(sale.private || 0);
//         const gov = Math.ceil(sale.gov || 0);
//         const total = cash + privateAmt + gov;

//         districtWiseTotals[districtName].cash += cash;
//         districtWiseTotals[districtName].private += privateAmt;
//         districtWiseTotals[districtName].gov += gov;
//         districtWiseTotals[districtName].total += total;

//         grandTotals.cash += cash;
//         grandTotals.private += privateAmt;
//         grandTotals.gov += gov;
//         grandTotals.total += total;
//       });

//       doc.addPage();
//       doc.fontSize(14).font("Helvetica-Bold").text(`Branch: ${branch}`);
//       doc.moveDown();

//       const colWidths = [150, 80, 80, 80, 80];
//       const headers = ["District", "Cash", "Private", "Gov", "Total"];
//       const startX = doc.x;
//       let y = doc.y;
//       const rowHeight = 20;

//       const drawRow = (values, isHeader = false) => {
//         let x = startX;
//         values.forEach((val, idx) => {
//           doc.rect(x, y, colWidths[idx], rowHeight).stroke();
//           doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
//             .fontSize(11)
//             .text(val, x + 5, y + 5, { width: colWidths[idx] - 10, align: idx === 0 ? 'left' : 'right' });
//           x += colWidths[idx];
//         });
//         y += rowHeight;
//         if (y > doc.page.height - 50) {
//           doc.addPage();
//           y = 40;
//         }
//       };

//       drawRow(headers, true);

//       Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//         drawRow([
//           district,
//           totals.cash,
//           totals.private,
//           totals.gov,
//           totals.total
//         ]);
//       });

//       drawRow([
//         "Grand Total",
//         grandTotals.cash,
//         grandTotals.private,
//         grandTotals.gov,
//         grandTotals.total
//       ], true);
//     }

//     doc.end();
//   } catch (error) {
//     console.error("Error generating sales PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// };
// exports.downloadSalesPDF = async (req, res) => {
//   try {
//     const { branches, fromDate, toDate } = req.body;

//     const from = new Date(fromDate);
//     const to = new Date(toDate);
//     to.setHours(23, 59, 59, 999); // Ensure end date is inclusive

//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     const chunks = [];
//     doc.on("data", chunk => chunks.push(chunk));
//     doc.on("end", () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
//       res.send(pdfBuffer);
//     });

//     // Title
//     doc.fontSize(18).font("Helvetica-Bold").text("Branch-wise Sales Report", { align: "center" });
//     doc.moveDown(0.5);

//     // Date range display
//     doc.fontSize(12).font("Helvetica")
//        .text(`From: ${fromDate}`, { align: "left" })
//        .text(`To: ${toDate}`, { align: "left" });
//     doc.moveDown(1);

//     for (const branch of branches) {
//       const allDistricts = await District.find({ branch }).lean();
//       const districtMap = new Map(allDistricts.map(d => [d.name, d]));

//       const sales = await Sale.find({ date: { $gte: fromDate, $lte: toDate } }).lean();
//       const filteredSales = sales.filter(s => districtMap.has(s.district));

//       const districtWiseTotals = {};
//       let grandTotals = { cash: 0, private: 0, gov: 0, total: 0 };

//       filteredSales.forEach(sale => {
//         const districtName = sale.district;
//         if (!districtWiseTotals[districtName]) {
//           districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
//         }

//         const cash = Math.ceil(sale.cash || 0);
//         const privateAmt = Math.ceil(sale.private || 0);
//         const gov = Math.ceil(sale.gov || 0);
//         const total = cash + privateAmt + gov;

//         districtWiseTotals[districtName].cash += cash;
//         districtWiseTotals[districtName].private += privateAmt;
//         districtWiseTotals[districtName].gov += gov;
//         districtWiseTotals[districtName].total += total;

//         grandTotals.cash += cash;
//         grandTotals.private += privateAmt;
//         grandTotals.gov += gov;
//         grandTotals.total += total;
//       });

//       // Start new section for each branch
//       doc.addPage();
//       doc.fontSize(14).font("Helvetica-Bold").text(`Branch: ${branch}`);
//       doc.moveDown();

//       const colWidths = [150, 80, 80, 80, 80];
//       const headers = ["District", "Cash", "Private", "Gov", "Total"];
//       const startX = doc.x;
//       let y = doc.y;
//       const rowHeight = 20;

//       const drawRow = (values, isHeader = false) => {
//         let x = startX;
//         values.forEach((val, idx) => {
//           doc.rect(x, y, colWidths[idx], rowHeight).stroke();
//           doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
//             .fontSize(11)
//             .text(val, x + 5, y + 5, {
//               width: colWidths[idx] - 10,
//               align: idx === 0 ? "left" : "right"
//             });
//           x += colWidths[idx];
//         });
//         y += rowHeight;

//         // Auto-paginate if near bottom
//         if (y > doc.page.height - 50) {
//           doc.addPage();
//           y = 40;
//         }
//       };

//       drawRow(headers, true);

//       Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//         drawRow([
//           district,
//           totals.cash,
//           totals.private,
//           totals.gov,
//           totals.total
//         ]);
//       });

//       drawRow([
//         "Grand Total",
//         grandTotals.cash,
//         grandTotals.private,
//         grandTotals.gov,
//         grandTotals.total
//       ], true);
//     }

//     // doc.addPage();
//     doc.end();
    
//   } catch (error) {
//     console.error("Error generating sales PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// };
// exports.downloadSalesPDF = async (req, res) => {
//   try {
//     const { branches, fromDate, toDate } = req.body;

//     const from = fromDate;
//     const to = toDate;

//     const doc = new PDFDocument({ margin: 40, size: "A4", autoFirstPage: false });
//     const chunks = [];
//     doc.on("data", chunk => chunks.push(chunk));
//     doc.on("end", () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
//       res.send(pdfBuffer);
//     });

//     const colWidths = [150, 80, 80, 80, 80];
//     const headers = ["District", "Cash", "Private", "Gov", "Total"];
//     const rowHeight = 20;

//     const drawHeader = (branch = null) => {
//       doc.addPage();
//       doc.fontSize(14).font("Helvetica-Bold").text("Branch-wise Sales Report", { align: "center" });
//       doc.moveDown(0.3);
//       doc.fontSize(11).font("Helvetica")
//          .text(`From: ${fromDate}`, { continued: true }).text(`   To: ${toDate}`, { align: "left" });
//       if (branch) {
//         doc.moveDown(0.5);
//         doc.fontSize(12).font("Helvetica-Bold").text(`Branch: ${branch}`);
//       }
//       doc.moveDown();
//     };

//     const drawRow = (values, y, startX, isHeader = false) => {
//       let x = startX;
//       values.forEach((val, idx) => {
//         doc.rect(x, y, colWidths[idx], rowHeight).stroke();
//         doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
//            .fontSize(10)
//            .text(val, x + 5, y + 5, {
//              width: colWidths[idx] - 10,
//              align: idx === 0 ? "left" : "right"
//            });
//         x += colWidths[idx];
//       });
//       return y + rowHeight;
//     };

//     let overallGrandTotals = { cash: 0, private: 0, gov: 0, total: 0 };
//     let isFirstPage = true;

//     for (const branch of branches) {
//       const allDistricts = await District.find({ branch }).lean();
//       const districtMap = new Map(allDistricts.map(d => [d.name, d]));
//       const sales = await Sale.find({ date: { $gte: from, $lte: to } }).lean();
//       const filteredSales = sales.filter(s => districtMap.has(s.district));

//       const districtWiseTotals = {};
//       let branchTotals = { cash: 0, private: 0, gov: 0, total: 0 };

//       filteredSales.forEach(sale => {
//         const districtName = sale.district;
//         if (!districtWiseTotals[districtName]) {
//           districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
//         }

//         const cash = Math.ceil(sale.cash || 0);
//         const privateAmt = Math.ceil(sale.private || 0);
//         const gov = Math.ceil(sale.gov || 0);
//         const total = cash + privateAmt + gov;

//         districtWiseTotals[districtName].cash += cash;
//         districtWiseTotals[districtName].private += privateAmt;
//         districtWiseTotals[districtName].gov += gov;
//         districtWiseTotals[districtName].total += total;

//         branchTotals.cash += cash;
//         branchTotals.private += privateAmt;
//         branchTotals.gov += gov;
//         branchTotals.total += total;
//       });

//       overallGrandTotals.cash += branchTotals.cash;
//       overallGrandTotals.private += branchTotals.private;
//       overallGrandTotals.gov += branchTotals.gov;
//       overallGrandTotals.total += branchTotals.total;

//       // Page setup
//       drawHeader(branch);

//       const startX = doc.x;
//       let y = doc.y;
//       y = drawRow(headers, y, startX, true);

//       for (const [district, totals] of Object.entries(districtWiseTotals)) {
//         y = drawRow([
//           district,
//           totals.cash,
//           totals.private,
//           totals.gov,
//           totals.total
//         ], y, startX);
//         if (y > doc.page.height - 50) {
//           drawHeader(branch);
//           y = doc.y;
//           y = drawRow(headers, y, startX, true);
//         }
//       }

//       y = drawRow([
//         "Branch Total",
//         branchTotals.cash,
//         branchTotals.private,
//         branchTotals.gov,
//         branchTotals.total
//       ], y, startX, true);
//     }

//     // Final Grand Totals page
//     drawHeader("Overall Grand Total (All Branches)");
//     const startX = doc.x;
//     let y = doc.y;
//     y = drawRow(headers, y, startX, true);
//     y = drawRow([
//       "Grand Total",
//       overallGrandTotals.cash,
//       overallGrandTotals.private,
//       overallGrandTotals.gov,
//       overallGrandTotals.total
//     ], y, startX, true);

//     doc.end();
//   } catch (error) {
//     console.error("Error generating sales PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// };

exports.downloadSalesPDF = async (req, res) => {
  try {
    const { branches, fromDate, toDate } = req.body;

    const from = fromDate
    const to = toDate

    const doc = new PDFDocument({ margin: 40, size: "A4", autoFirstPage: false });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");
      res.send(pdfBuffer);
    });

    const colWidths = [150, 80, 80, 80, 80];
    const headers = ["District", "Cash", "Private", "Gov", "Total"];
    const rowHeight = 20;

    const formatIndianDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};


    const drawHeader = (branch = null) => {
        const formattedFrom = formatIndianDate(fromDate);
const formattedTo = formatIndianDate(toDate);


      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text("Branch-wise Sales Report", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(11).font("Helvetica")
         .text(`From: ${formattedFrom}`, { continued: true }).text(`   To: ${formattedTo}`, { align: "left" });
      if (branch) {
        doc.moveDown(0.5);
        doc.fontSize(12).font("Helvetica-Bold").text(`Branch: ${branch}`);
      }
      doc.moveDown();
    };

    const drawRow = (values, y, startX, isHeader = false) => {
      let x = startX;
      values.forEach((val, idx) => {
        doc.rect(x, y, colWidths[idx], rowHeight).stroke();
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
           .fontSize(10)
           .text(val, x + 5, y + 5, {
             width: colWidths[idx] - 10,
             align: idx === 0 ? "left" : "right"
           });
        x += colWidths[idx];
      });
      return y + rowHeight;
    };

    let overallGrandTotals = { cash: 0, private: 0, gov: 0, total: 0 };
    const branchTotalsList = [];

    for (const branch of branches) {
      const allDistricts = await District.find({ branch }).lean();
      const districtMap = new Map(allDistricts.map(d => [d.name, d]));
      const sales = await Sale.find({ date: { $gte: from, $lte: to } }).lean();
      const filteredSales = sales.filter(s => districtMap.has(s.district));

      const districtWiseTotals = {};
      let branchTotals = { cash: 0, private: 0, gov: 0, total: 0 };

      filteredSales.forEach(sale => {
        const districtName = sale.district;
        if (!districtWiseTotals[districtName]) {
          districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
        }

        const cash = Math.ceil(sale.cash || 0);
        const privateAmt = Math.ceil(sale.private || 0);
        const gov = Math.ceil(sale.gov || 0);
        const total = cash + privateAmt + gov;

        districtWiseTotals[districtName].cash += cash;
        districtWiseTotals[districtName].private += privateAmt;
        districtWiseTotals[districtName].gov += gov;
        districtWiseTotals[districtName].total += total;

        branchTotals.cash += cash;
        branchTotals.private += privateAmt;
        branchTotals.gov += gov;
        branchTotals.total += total;
      });

      // Add to grand total
      overallGrandTotals.cash += branchTotals.cash;
      overallGrandTotals.private += branchTotals.private;
      overallGrandTotals.gov += branchTotals.gov;
      overallGrandTotals.total += branchTotals.total;

      branchTotalsList.push({ branch, ...branchTotals });

      // Draw branch page
      drawHeader(branch);
      const startX = doc.x;
      let y = doc.y;
      y = drawRow(headers, y, startX, true);

      for (const [district, totals] of Object.entries(districtWiseTotals)) {
        y = drawRow([
          district,
          totals.cash,
          totals.private,
          totals.gov,
          totals.total
        ], y, startX);

        if (y > doc.page.height - 50) {
          drawHeader(branch);
          y = doc.y;
          y = drawRow(headers, y, startX, true);
        }
      }

      y = drawRow([
        "Branch Total",
        branchTotals.cash,
        branchTotals.private,
        branchTotals.gov,
        branchTotals.total
      ], y, startX, true);
    }

    // Draw final summary page with all branches
    drawHeader("Overall Branch Totals");

    const summaryHeaders = ["Branch", "Cash", "Private", "Gov", "Total"];
    const startX = doc.x;
    let y = doc.y;

    y = drawRow(summaryHeaders, y, startX, true);

    for (const b of branchTotalsList) {
      y = drawRow([
        b.branch,
        b.cash,
        b.private,
        b.gov,
        b.total
      ], y, startX);
    }

    y = drawRow([
      "Grand Total",
      overallGrandTotals.cash,
      overallGrandTotals.private,
      overallGrandTotals.gov,
      overallGrandTotals.total
    ], y, startX, true);

    doc.end();
  } catch (error) {
    console.error("Error generating sales PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};





// Download Receipts PDF
// exports.downloadReceiptsPDF = async (req, res) => {
//   try {
//     const { branches } = req.body;
//     const receipts = await Promise.all(branches.map(async (branch) => {
//       const receiptList = await Receipt.find({ branch });
//       const totalReceipts = receiptList.reduce((sum, r) => sum + r.cash + r.online + r.bank, 0);
//       return { branch, totalReceipts };
//     }));

//     const doc = new PDFDocument();
//     res.setHeader('Content-Disposition', 'attachment; filename=receipts_report.pdf');
//     res.setHeader('Content-Type', 'application/pdf');
//     doc.pipe(res);

//     doc.fontSize(18).text('Receipts Report', { align: 'center' }).moveDown();
//     receipts.forEach(({ branch, totalReceipts }) => {
//       doc.fontSize(14).text(`Branch: ${branch}`);
//       doc.text(`Total Receipts: ${totalReceipts}`);
//       doc.moveDown();
//     });

//     doc.end();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('PDF generation error');
//   }
// };
// exports.downloadReceiptsPDF = async (req, res) => {
//   try {
//     const { branches, startDate, endDate } = req.body;
//     const from = new Date(startDate);
//     const to = new Date(endDate);
//     to.setHours(23, 59, 59, 999);

//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     const chunks = [];
//     doc.on("data", chunk => chunks.push(chunk));
//     doc.on("end", () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=receipts_report.pdf");
//       res.send(pdfBuffer);
//     });

//     doc.fontSize(16).font("Helvetica-Bold").text("Branch-wise Receipts Report", { align: "center" });
//     doc.moveDown();

//     for (const branch of branches) {
//       const allDistricts = await District.find({ branch }).lean();
//       const districtMap = new Map(allDistricts.map(d => [d.name, d]));
//       const receipts = await Receipt.find({ date: { $gte: from, $lte: to } }).lean();
//       const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

//       const districtWiseTotals = {};
//       let grandTotals = { cash: 0, private: 0, gov: 0, total: 0 };

//       filteredReceipts.forEach(receipt => {
//         const districtName = receipt.district;
//         if (!districtWiseTotals[districtName]) {
//           districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
//         }

//         const cash = Math.ceil(receipt.cash || 0);
//         const private = Math.ceil(receipt.private || 0);
//         const gov = Math.ceil(receipt.gov || 0);
//         const total = cash + private + gov;

//         districtWiseTotals[districtName].cash += cash;
//         districtWiseTotals[districtName].private += private;
//         districtWiseTotals[districtName].gov += gov;
//         districtWiseTotals[districtName].total += total;

//         grandTotals.cash += cash;
//         grandTotals.private += private;
//         grandTotals.gov += gov;
//         grandTotals.total += total;
//       });

//       doc.addPage();
//       doc.fontSize(14).font("Helvetica-Bold").text(`Branch: ${branch}`);
//       doc.moveDown();

//       const colWidths = [150, 80, 80, 80, 80];
//       const headers = ["District", "Cash", "private", "gov", "Total"];
//       const startX = doc.x;
//       let y = doc.y;
//       const rowHeight = 20;

//       const drawRow = (values, isHeader = false) => {
//         let x = startX;
//         values.forEach((val, idx) => {
//           doc.rect(x, y, colWidths[idx], rowHeight).stroke();
//           doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
//              .fontSize(11)
//              .text(val, x + 5, y + 5, { width: colWidths[idx] - 10, align: idx === 0 ? 'left' : 'right' });
//           x += colWidths[idx];
//         });
//         y += rowHeight;
//         if (y > doc.page.height - 50) {
//           doc.addPage();
//           y = 40;
//         }
//       };

//       drawRow(headers, true);

//       Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//         drawRow([
//           district,
//           Math.ceil(totals.cash),
//           Math.ceil(totals.private),
//           Math.ceil(totals.gov),
//           Math.ceil(totals.total)
//         ]);
//       });

//       drawRow([
//         "Grand Total",
//         Math.ceil(grandTotals.cash),
//         Math.ceil(grandTotals.private),
//         Math.ceil(grandTotals.gov),
//         Math.ceil(grandTotals.total)
//       ], true);
//     }

//     doc.end();
//   } catch (error) {
//     console.error("Error generating receipts PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// };
exports.downloadReceiptsPDF = async (req, res) => {
  try {
    const { branches, fromDate, toDate } = req.body;
    const from = fromDate;
    const to = toDate;

    const doc = new PDFDocument({ margin: 40, size: "A4", autoFirstPage: false });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=receipts_report.pdf");
      res.send(pdfBuffer);
    });

    const colWidths = [150, 80, 80, 80, 80];
    const headers = ["District", "Cash", "Private", "Gov", "Total"];
    const rowHeight = 20;

    const formatIndianDate = (dateStr) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const drawHeader = (branch = null) => {
      const formattedFrom = formatIndianDate(fromDate);
      const formattedTo = formatIndianDate(toDate);

      doc.addPage();
      doc.fontSize(14).font("Helvetica-Bold").text("Branch-wise Receipts Report", { align: "center" });
      doc.moveDown(0.3);
      doc.fontSize(11).font("Helvetica")
         .text(`From: ${formattedFrom}`, { continued: true }).text(`   To: ${formattedTo}`, { align: "left" });
      if (branch) {
        doc.moveDown(0.5);
        doc.fontSize(12).font("Helvetica-Bold").text(`Branch: ${branch}`);
      }
      doc.moveDown();
    };

    const drawRow = (values, y, startX, isHeader = false) => {
      let x = startX;
      values.forEach((val, idx) => {
        doc.rect(x, y, colWidths[idx], rowHeight).stroke();
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
           .fontSize(10)
           .text(val, x + 5, y + 5, {
             width: colWidths[idx] - 10,
             align: idx === 0 ? "left" : "right"
           });
        x += colWidths[idx];
      });
      return y + rowHeight;
    };

    let overallGrandTotals = { cash: 0, private: 0, gov: 0, total: 0 };
    const branchTotalsList = [];

    for (const branch of branches) {
      const allDistricts = await District.find({ branch }).lean();
      const districtMap = new Map(allDistricts.map(d => [d.name, d]));
      const receipts = await Receipt.find({
        date: { $gte: from, $lte: to }
      }).lean();

      const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

      const districtWiseTotals = {};
      let branchTotals = { cash: 0, private: 0, gov: 0, total: 0 };

      filteredReceipts.forEach(receipt => {
        const district = receipt.district;
        if (!districtWiseTotals[district]) {
          districtWiseTotals[district] = { cash: 0, private: 0, gov: 0, total: 0 };
        }

        const cash = Math.ceil(receipt.cash || 0);
        const privateAmt = Math.ceil(receipt.private || 0);
        const gov = Math.ceil(receipt.gov || 0);
        const total = cash + privateAmt + gov;

        districtWiseTotals[district].cash += cash;
        districtWiseTotals[district].private += privateAmt;
        districtWiseTotals[district].gov += gov;
        districtWiseTotals[district].total += total;

        branchTotals.cash += cash;
        branchTotals.private += privateAmt;
        branchTotals.gov += gov;
        branchTotals.total += total;
      });

      overallGrandTotals.cash += branchTotals.cash;
      overallGrandTotals.private += branchTotals.private;
      overallGrandTotals.gov += branchTotals.gov;
      overallGrandTotals.total += branchTotals.total;

      branchTotalsList.push({ branch, ...branchTotals });

      // Draw receipt table
      drawHeader(branch);
      const startX = doc.x;
      let y = doc.y;
      y = drawRow(headers, y, startX, true);

      for (const [district, totals] of Object.entries(districtWiseTotals)) {
        y = drawRow([
          district,
          totals.cash,
          totals.private,
          totals.gov,
          totals.total
        ], y, startX);

        if (y > doc.page.height - 50) {
          drawHeader(branch);
          y = doc.y;
          y = drawRow(headers, y, startX, true);
        }
      }

      y = drawRow([
        "Branch Total",
        branchTotals.cash,
        branchTotals.private,
        branchTotals.gov,
        branchTotals.total
      ], y, startX, true);
    }

    // Final summary page
    drawHeader("Overall Branch Totals");
    const summaryHeaders = ["Branch", "Cash", "Private", "Gov", "Total"];
    const startX = doc.x;
    let y = doc.y;

    y = drawRow(summaryHeaders, y, startX, true);

    for (const b of branchTotalsList) {
      y = drawRow([
        b.branch,
        b.cash,
        b.private,
        b.gov,
        b.total
      ], y, startX);
    }

    y = drawRow([
      "Grand Total",
      overallGrandTotals.cash,
      overallGrandTotals.private,
      overallGrandTotals.gov,
      overallGrandTotals.total
    ], y, startX, true);

    doc.end();
  } catch (error) {
    console.error("Error generating receipts PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};