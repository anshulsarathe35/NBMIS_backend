// // // backend/controllers/reportController.js

// // const reportController = {
// //     // Get reports for a particular date range
// //     getReports: (req, res) => {
// //       const { fromDate, toDate } = req.query;
// //       // Add logic here to fetch the reports based on date range
// //       res.status(200).send(`Reports from ${fromDate} to ${toDate}`);
// //     },
  
// //     // Download sales report as Excel
// //     downloadSalesExcel: (req, res) => {
// //       const { fromDate, toDate } = req.query;
// //       // Add logic here to generate and send the sales report as Excel
// //       res.status(200).send(`Sales report in Excel from ${fromDate} to ${toDate}`);
// //     },
  
// //     // Download sales report as PDF
// //     downloadSalesPDF: (req, res) => {
// //       const { fromDate, toDate } = req.query;
// //       // Add logic here to generate and send the sales report as PDF
// //       res.status(200).send(`Sales report in PDF from ${fromDate} to ${toDate}`);
// //     },
  
// //     // Download receipts report as Excel
// //     downloadReceiptsExcel: (req, res) => {
// //       const { fromDate, toDate } = req.query;
// //       // Add logic here to generate and send the receipts report as Excel
// //       res.status(200).send(`Receipts report in Excel from ${fromDate} to ${toDate}`);
// //     },
  
// //     // Download receipts report as PDF
// //     downloadReceiptsPDF: (req, res) => {
// //       const { fromDate, toDate } = req.query;
// //       // Add logic here to generate and send the receipts report as PDF
// //       res.status(200).send(`Receipts report in PDF from ${fromDate} to ${toDate}`);
// //     }
// //   };
  
// //   module.exports = reportController;
  
// // backend/controllers/reportController.js

// const reportController = {
//     getReports: (req, res) => {
//       const { startDate, endDate } = req.query;
  
//       // Mock data for demonstration purposes
//       const mockSales = [
//         { district: 'District A', date: '2025-05-01', amount: 1000 },
//         { district: 'District B', date: '2025-05-02', amount: 1500 },
//       ];
  
//       const mockReceipts = [
//         { district: 'District A', date: '2025-05-01', cash: 500, bank: 200, online: 300 },
//         { district: 'District B', date: '2025-05-02', cash: 600, bank: 400, online: 500 },
//       ];
  
//       res.status(200).json({ sales: mockSales, receipts: mockReceipts });
//     },
  
//     downloadSalesExcel: (req, res) => {
//       const { fromDate, toDate } = req.query;
//       res.status(200).send(`Sales report in Excel from ${fromDate} to ${toDate}`);
//     },
  
//     downloadSalesPDF: (req, res) => {
//       const { fromDate, toDate } = req.query;
//       res.status(200).send(`Sales report in PDF from ${fromDate} to ${toDate}`);
//     },
  
//     downloadReceiptsExcel: (req, res) => {
//       const { fromDate, toDate } = req.query;
//       res.status(200).send(`Receipts report in Excel from ${fromDate} to ${toDate}`);
//     },
  
//     downloadReceiptsPDF: (req, res) => {
//       const { fromDate, toDate } = req.query;
//       res.status(200).send(`Receipts report in PDF from ${fromDate} to ${toDate}`);
//     }
//   };
  
//   module.exports = reportController;
  


// backend/controllers/reportController.js

// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

// const reportController = {
//     // Get actual reports based on date range
//     getReports: async (req, res) => {
//       try {
//         const { startDate, endDate } = req.query;
  
//         if (!startDate || !endDate) {
//           return res.status(400).json({ error: 'Start and end dates are required' });
//         }
  
//         // Convert the startDate and endDate to Date objects
//         const start = new Date(startDate);
//         const end = new Date(endDate);
        
//         // Set the end date to the end of the day (23:59:59.999)
//         end.setHours(23, 59, 59, 999);
  
//         // Fetch sales between dates
//         const sales = await Sale.find({
//           date: {
//             $gte: start,
//             $lte: end,
//           },
//         })
//           .populate('district', 'name')
//           .lean();
  
//         // Format sales data
//         const formattedSales = sales.map((sale) => ({
//           district: sale.district.name,
//           date: sale.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//           amount: sale.amount,
//         }));
  
//         // Fetch receipts between dates
//         const receipts = await Receipt.find({
//           date: {
//             $gte: start,
//             $lte: end,
//           },
//         })
//           .populate('district', 'name')
//           .lean();
  
//         // Format receipts data
//         const formattedReceipts = receipts.map((r) => ({
//           district: r.district.name,
//           date: r.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//           cash: r.cash,
//           bank: r.bank,
//           online: r.online,
//         }));
  
//         res.status(200).json({
//           sales: formattedSales,
//           receipts: formattedReceipts,
//         });
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//         res.status(500).json({ error: 'Failed to fetch reports' });
//       }
//     },

//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//       .populate('district', 'name')
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Amount']);
//     sales.forEach((s) =>
//       worksheet.addRow([s.district.name, s.date.toISOString().split('T')[0], s.amount])
//     );

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const receipts = await Receipt.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//       .populate('district', 'name')
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);
//     receipts.forEach((r) =>
//       worksheet.addRow([r.district.name, r.date.toISOString().split('T')[0], r.cash, r.bank, r.online])
//     );

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//       .populate('district', 'name')
//       .lean();

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
//     doc.fontSize(14).text('Sales Report', { align: 'center' });
//     doc.moveDown();

//     sales.forEach((s) => {
//       doc.text(`District: ${s.district.name} | Date: ${s.date.toISOString().split('T')[0]} | Amount: ${s.amount}`);
//     });

//     doc.end();
//   },

//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const receipts = await Receipt.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//       .populate('district', 'name')
//       .lean();

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
//     doc.fontSize(14).text('Receipts Report', { align: 'center' });
//     doc.moveDown();

//     receipts.forEach((r) => {
//       doc.text(
//         `District: ${r.district.name} | Date: ${r.date.toISOString().split('T')[0]} | Cash: ${r.cash} | Bank: ${r.bank} | Online: ${r.online}`
//       );
//     });

//     doc.end();
//   },
// };

// module.exports = reportController;

// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

// const reportController = {
//   // Get actual reports based on date range
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;

//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       // Convert the startDate and endDate to Date objects
//       const start = new Date(startDate);
//       const end = new Date(endDate);
      
//       // Set the end date to the end of the day (23:59:59.999)
//       end.setHours(23, 59, 59, 999);

//       // Fetch sales between dates
//       const sales = await Sale.find({
//         date: {
//           $gte: start,
//           $lte: end,
//         },
//       })
//         .populate('district', 'name')
//         .lean();

//       // Format sales data
//       const formattedSales = sales.map((sale) => ({
//         district: sale.district.name,
//         date: sale.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//         amount: sale.amount,
//       }));

//       // Fetch receipts between dates
//       const receipts = await Receipt.find({
//         date: {
//           $gte: start,
//           $lte: end,
//         },
//       })
//         .populate('district', 'name')
//         .lean();

//       // Format receipts data
//       const formattedReceipts = receipts.map((r) => ({
//         district: r.district.name,
//         date: r.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online,
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   // Download Sales Report as Excel
//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
    
//     try {
//       const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Sales Report');
//       worksheet.addRow(['District', 'Date', 'Amount']);
//       sales.forEach((s) =>
//         worksheet.addRow([s.district.name, s.date.toISOString().split('T')[0], s.amount])
//       );

//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Error generating Excel for sales:', error);
//       res.status(500).json({ error: 'Failed to generate sales Excel report' });
//     }
//   },

//   // Download Receipts Report as Excel
//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const receipts = await Receipt.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Receipts Report');
//       worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);
//       receipts.forEach((r) =>
//         worksheet.addRow([r.district.name, r.date.toISOString().split('T')[0], r.cash, r.bank, r.online])
//       );

//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Error generating Excel for receipts:', error);
//       res.status(500).json({ error: 'Failed to generate receipts Excel report' });
//     }
//   },

//   // Download Sales Report as PDF
//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       const doc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//       doc.pipe(res);
//       doc.fontSize(14).text('Sales Report', { align: 'center' });
//       doc.moveDown();

//       sales.forEach((s) => {
//         doc.text(`District: ${s.district.name} | Date: ${s.date.toISOString().split('T')[0]} | Amount: ${s.amount}`);
//       });

//       doc.end();
//     } catch (error) {
//       console.error('Error generating PDF for sales:', error);
//       res.status(500).json({ error: 'Failed to generate sales PDF report' });
//     }
//   },

//   // Download Receipts Report as PDF
//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const receipts = await Receipt.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       const doc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//       doc.pipe(res);
//       doc.fontSize(14).text('Receipts Report', { align: 'center' });
//       doc.moveDown();

//       receipts.forEach((r) => {
//         doc.text(
//           `District: ${r.district.name} | Date: ${r.date.toISOString().split('T')[0]} | Cash: ${r.cash} | Bank: ${r.bank} | Online: ${r.online}`
//         );
//       });

//       doc.end();
//     } catch (error) {
//       console.error('Error generating PDF for receipts:', error);
//       res.status(500).json({ error: 'Failed to generate receipts PDF report' });
//     }
//   },
// };

// module.exports = reportController;




// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

// const reportController = {
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;

//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       // Convert the startDate and endDate to Date objects
//       const start = new Date(startDate);
//       const end = new Date(endDate);

//       // Set the end date to the end of the day (23:59:59.999)
//       end.setHours(23, 59, 59, 999);

//       // Log the date range
//       console.log('Fetching reports between:', start.toISOString(), 'and', end.toISOString());

//       // Fetch sales between dates
//       const sales = await Sale.find({
//         date: {
//           $gte: start,
//           $lte: end,
//         },
//       })
//         .populate('district', 'name')
//         .lean();

//       // Log the fetched sales data
//       console.log('Fetched sales:', sales);

//       // Format sales data
//       const formattedSales = sales.map((sale) => ({
//         district: sale.district.name,
//         date: sale.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//         amount: sale.amount,
//       }));

//       // Fetch receipts between dates
//       const receipts = await Receipt.find({
//         date: {
//           $gte: start,
//           $lte: end,
//         },
//       })
//         .populate('district', 'name')
//         .lean();

//       // Log the fetched receipts data
//       console.log('Fetched receipts:', receipts);

//       // Format receipts data
//       const formattedReceipts = receipts.map((r) => ({
//         district: r.district.name,
//         date: r.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online,
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   // Download Sales Report as Excel
//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       console.log('Sales data for Excel:', sales);  // Log the fetched data

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Sales Report');
//       worksheet.addRow(['District', 'Date', 'Amount']);
//       sales.forEach((s) =>
//         worksheet.addRow([s.district.name, s.date.toISOString().split('T')[0], s.amount])
//       );

//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Error generating Excel for sales:', error);
//       res.status(500).json({ error: 'Failed to generate sales Excel report' });
//     }
//   },

//   // Download Receipts Report as Excel
//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const receipts = await Receipt.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       console.log('Receipts data for Excel:', receipts);  // Log the fetched data

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Receipts Report');
//       worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);
//       receipts.forEach((r) =>
//         worksheet.addRow([r.district.name, r.date.toISOString().split('T')[0], r.cash, r.bank, r.online])
//       );

//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Error generating Excel for receipts:', error);
//       res.status(500).json({ error: 'Failed to generate receipts Excel report' });
//     }
//   },

//   // Download Sales Report as PDF
//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       console.log('Sales data for PDF:', sales);  // Log the fetched data

//       const doc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//       doc.pipe(res);
//       doc.fontSize(14).text('Sales Report', { align: 'center' });
//       doc.moveDown();

//       sales.forEach((s) => {
//         doc.text(`District: ${s.district.name} | Date: ${s.date.toISOString().split('T')[0]} | Amount: ${s.amount}`);
//       });

//       doc.end();
//     } catch (error) {
//       console.error('Error generating PDF for sales:', error);
//       res.status(500).json({ error: 'Failed to generate sales PDF report' });
//     }
//   },

//   // Download Receipts Report as PDF
//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;

//     try {
//       const receipts = await Receipt.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } })
//         .populate('district', 'name')
//         .lean();

//       console.log('Receipts data for PDF:', receipts);  // Log the fetched data

//       const doc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//       doc.pipe(res);
//       doc.fontSize(14).text('Receipts Report', { align: 'center' });
//       doc.moveDown();

//       receipts.forEach((r) => {
//         doc.text(
//           `District: ${r.district.name} | Date: ${r.date.toISOString().split('T')[0]} | Cash: ${r.cash} | Bank: ${r.bank} | Online: ${r.online}`
//         );
//       });

//       doc.end();
//     } catch (error) {
//       console.error('Error generating PDF for receipts:', error);
//       res.status(500).json({ error: 'Failed to generate receipts PDF report' });
//     }
//   },
// };

// module.exports = reportController;



//corrected one --------------------------important

// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

// const reportController = {
//   // Get actual reports based on date range
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;

//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       // Fetch sales between dates
//       const sales = await Sale.find({
//         date: {
//           $gte: startDate,  // Directly compare the string dates
//           $lte: endDate,
//         },
//       })
//         .populate('district', 'name')
//         .lean();

//       // Format sales data
//       const formattedSales = sales.map((sale) => ({
//         district: sale.district,
//         date: sale.date,  // Keep the string date format
//         amount: sale.amount,
//       }));

//       // Fetch receipts between dates
//       const receipts = await Receipt.find({
//         date: {
//           $gte: startDate,  // Directly compare the string dates
//           $lte: endDate,
//         },
//       })
//         .populate('district', 'name')
//         .lean();

//       // Format receipts data
//       const formattedReceipts = receipts.map((r) => ({
//         district: r.district,
//         date: r.date,  // Keep the string date format
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online,
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   // Download sales report as Excel
//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const sales = await Sale.find({
//       date: { $gte: startDate, $lte: endDate },  // Compare string dates
//     }).populate('district', 'name').lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Amount']);
//     sales.forEach((s) =>
//       worksheet.addRow([s.district, s.date, s.amount])  // Keep string date format
//     );

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   // Download receipts report as Excel
//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const receipts = await Receipt.find({
//       date: { $gte: startDate, $lte: endDate },  // Compare string dates
//     }).populate('district', 'name').lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);
//     receipts.forEach((r) =>
//       worksheet.addRow([r.district, r.date, r.cash, r.bank, r.online])  // Keep string date format
//     );

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   // Download sales report as PDF
//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const sales = await Sale.find({
//       date: { $gte: startDate, $lte: endDate },  // Compare string dates
//     }).populate('district', 'name').lean();

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
//     doc.fontSize(14).text('Sales Report', { align: 'center' });
//     doc.moveDown();

//     sales.forEach((s) => {
//       doc.text(`District: ${s.district} | Date: ${s.date} | Amount: ${s.amount}`);
//     });

//     doc.end();
//   },

//   // Download receipts report as PDF
//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const receipts = await Receipt.find({
//       date: { $gte: startDate, $lte: endDate },  // Compare string dates
//     }).populate('district', 'name').lean();

//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
//     doc.fontSize(14).text('Receipts Report', { align: 'center' });
//     doc.moveDown();

//     receipts.forEach((r) => {
//       doc.text(
//         `District: ${r.district} | Date: ${r.date} | Cash: ${r.cash} | Bank: ${r.bank} | Online: ${r.online}`
//       );
//     });

//     doc.end();
//   },
// };

// module.exports = reportController;




// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');

// const reportController = {
//   // Fetch both reports in JSON
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const sales = await Sale.find({
//         date: { $gte: startDate, $lte: endDate },
//       }).populate('district', 'name').lean();

//       const receipts = await Receipt.find({
//         date: { $gte: startDate, $lte: endDate },
//       }).populate('district', 'name').lean();

//       const formattedSales = sales.map((s) => ({
//         district: s.district,
//         date: s.date.toISOString().split('T')[0],
//         amount: s.amount,
//       }));

//       const formattedReceipts = receipts.map((r) => ({
//         district: r.district,
//         date: r.date.toISOString().split('T')[0],
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online,
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   // Excel: Sales
//   downloadSalesExcel: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const sales = await Sale.find({
//         date: { $gte: startDate, $lte: endDate },
//       }).populate('district', 'name').lean();

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Sales Report');

//       worksheet.addRow(['District', 'Date', 'Amount']);
//       sales.forEach((s) =>
//         worksheet.addRow([
//           s.district,
//           s.date.toISOString().split('T')[0],
//           s.amount,
//         ])
//       );

//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`
//       );
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Error downloading sales Excel:', error);
//       res.status(500).json({ error: 'Failed to generate Excel' });
//     }
//   },

//   // Excel: Receipts
//   downloadReceiptsExcel: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const receipts = await Receipt.find({
//         date: { $gte: startDate, $lte: endDate },
//       }).populate('district', 'name').lean();

//       const workbook = new ExcelJS.Workbook();
//       const worksheet = workbook.addWorksheet('Receipts Report');

//       worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);
//       receipts.forEach((r) =>
//         worksheet.addRow([
//           r.district,
//           r.date.toISOString().split('T')[0],
//           r.cash,
//           r.bank,
//           r.online,
//         ])
//       );

//       res.setHeader(
//         'Content-Disposition',
//         `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`
//       );
//       res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//       await workbook.xlsx.write(res);
//       res.end();
//     } catch (error) {
//       console.error('Error downloading receipts Excel:', error);
//       res.status(500).json({ error: 'Failed to generate Excel' });
//     }
//   },

//   // PDF: Sales
//   downloadSalesPDF: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const sales = await Sale.find({
//         date: { $gte: startDate, $lte: endDate },
//       }).populate('district', 'name').lean();

//       const doc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//       doc.pipe(res);
//       doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown();

//       sales.forEach((s) => {
//         doc.fontSize(12).text(
//           `District: ${s.district} | Date: ${s.date.toISOString().split('T')[0]} | Amount: ${s.amount}`
//         );
//       });

//       doc.end();
//     } catch (error) {
//       console.error('Error downloading sales PDF:', error);
//       res.status(500).json({ error: 'Failed to generate PDF' });
//     }
//   },

//   // PDF: Receipts
//   downloadReceiptsPDF: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const receipts = await Receipt.find({
//         date: { $gte: startDate, $lte: endDate },
//       }).populate('district', 'name').lean();

//       const doc = new PDFDocument();
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//       doc.pipe(res);
//       doc.fontSize(16).text('Receipts Report', { align: 'center' }).moveDown();

//       receipts.forEach((r) => {
//         doc.fontSize(12).text(
//           `District: ${r.district} | Date: ${r.date.toISOString().split('T')[0]} | Cash: ${r.cash} | Bank: ${r.bank} | Online: ${r.online}`
//         );
//       });

//       doc.end();
//     } catch (error) {
//       console.error('Error downloading receipts PDF:', error);
//       res.status(500).json({ error: 'Failed to generate PDF' });
//     }
//   },
// };

// module.exports = reportController;

// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const moment = require('moment')


// const reportController = {
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//         .populate('district', 'name')
//         .lean();

//       const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//         .populate('district', 'name')
//         .lean();

//       const formattedSales = sales.map(s => ({
//         district: s.district,
//         date: s.date,
//         amount: s.amount
//       }));

//       const formattedReceipts = receipts.map(r => ({
//         district: r.district,
//         date: r.date,
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate('district', 'name')
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Amount']);

//     let totalAmount = 0;
//     sales.forEach(s => {
//       worksheet.addRow([s.district, s.date, s.amount]);
//       totalAmount += s.amount;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalAmount]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate('district', 'name')
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);

//     let totalCash = 0, totalBank = 0, totalOnline = 0;
//     receipts.forEach(r => {
//       worksheet.addRow([r.district, r.date, r.cash, r.bank, r.online]);
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalBank, totalOnline]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`+".xlsx");
//     // res.setHeader('Content-Disposition', `attachment; filename="receipts-${startDate}_to_${endDate}.xlsx"`);


//     await workbook.xlsx.write(res);
//     res.end();
//   },



// downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
  
//     // Ensure correct date format for query and rendering
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
//     const sales = await Sale.find({
//       date: { $gte: formattedStartDate, $lte: formattedEndDate },
//     })
//       .populate('district', 'name')
//       .lean();
  
//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
  
//     doc.fontSize(16).text('Sales Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();
  
//     const tableTop = doc.y;
//     const colWidths = [150, 150, 150]; // District, Date, Amount
  
//     // Draw headers
//     const headers = ['District', 'Date', 'Amount'];
//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });
  
//     let y = tableTop + 20;
//     let totalAmount = 0;
  
//     sales.forEach((s) => {
//       const row = [s.district, moment(s.date).format('YYYY-MM-DD'), s.amount.toString()];  // Format date
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
//       totalAmount += s.amount;
//       y += 20;
//     });
  
//     // Total Row
//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);
//     doc.rect(40 + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();
//     doc.text(totalAmount.toString(), 45 + colWidths[0] + colWidths[1], y + 5);
  
//     doc.end();
//   },


// downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
  
//     // Ensure correct date format for query and rendering
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
//     const receipts = await Receipt.find({
//       date: { $gte: formattedStartDate, $lte: formattedEndDate },
//     })
//       .populate('district', 'name')
//       .lean();
  
//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
  
//     doc.fontSize(16).text('Receipts Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();
  
//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100]; // District, Date, Cash, Bank, Online
  
//     // Draw headers
//     const headers = ['District', 'Date', 'Cash', 'Bank', 'Online'];
//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });
  
//     let y = tableTop + 20;
//     let totalCash = 0, totalBank = 0, totalOnline = 0;
  
//     receipts.forEach((r) => {
//       const row = [
//         r.district,
//         moment(r.date).format('YYYY-MM-DD'),  // Format date
//         r.cash.toString(),
//         r.bank.toString(),
//         r.online.toString()
//       ];
  
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
  
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//       y += 20;
//     });
  
//     // Totals row
//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);
//     const totals = [totalCash, totalBank, totalOnline];
//     totals.forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(total.toString(), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });
  
//     doc.end();
//   }
// };

// module.exports = reportController;



//new
// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const moment = require('moment');
// const User = require('../models/User')



// const reportController = {
//     getReports: async (req, res) => {
//       try {
//         const { startDate, endDate } = req.query;
//         const userId = req.user?._id;
//         console.log(req)
  
//         if (!startDate || !endDate) {
//           return res.status(400).json({ error: 'Start and end dates are required' });
//         }
  
//         const user = await User.findById(userId).lean();
//         if (!user) return res.status(404).json({ error: 'User not found' });
  
//         const branch = user.branch;
  
//         const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//           .populate('district', 'name branch')
//           .lean();
  
//         const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//           .populate('district', 'name branch')
//           .lean();
  
//         const filteredSales = sales.filter(s => s.district?.branch?.toString() === branch.toString());
//         const filteredReceipts = receipts.filter(r => r.district?.branch?.toString() === branch.toString());
  
//         const formattedSales = filteredSales.map(s => ({
//           district: s.district.name,
//           date: s.date,
//           amount: s.amount
//         }));
  
//         const formattedReceipts = filteredReceipts.map(r => ({
//           district: r.district.name,
//           date: r.date,
//           cash: r.cash,
//           bank: r.bank,
//           online: r.online
//         }));
  
//         res.status(200).json({
//           sales: formattedSales,
//           receipts: formattedReceipts,
//         });
//       } catch (error) {
//         console.error('Error fetching reports:', error);
//         res.status(500).json({ error: 'Failed to fetch reports' });
//       }
  
//   },

//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     // const userBranch = req.user.branch;
//     const user = JSON.parse(localStorage.getItem('user'));
//     const userBranch = user?.branch;
//     const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate({
//         path: 'district',
//         select: 'name branch',
//         match: { branch: userBranch }
//       })
//       .lean();

//     const filteredSales = sales.filter(s => s.district !== null);

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Amount']);

//     let totalAmount = 0;
//     filteredSales.forEach(s => {
//       worksheet.addRow([s.district.name, s.date, s.amount]);
//       totalAmount += s.amount;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalAmount]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     // const userBranch = req.user.branch;
//     const user = JSON.parse(localStorage.getItem('user'));
// const userBranch = user?.branch;

//     const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate({
//         path: 'district',
//         select: 'name branch',
//         match: { branch: userBranch }
//       })
//       .lean();

//     const filteredReceipts = receipts.filter(r => r.district !== null);

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);

//     let totalCash = 0, totalBank = 0, totalOnline = 0;
//     filteredReceipts.forEach(r => {
//       worksheet.addRow([r.district.name, r.date, r.cash, r.bank, r.online]);
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalBank, totalOnline]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     // const userBranch = req.user.branch;

//     const user = JSON.parse(localStorage.getItem('user'));
// const userBranch = user?.branch;
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

//     const sales = await Sale.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } })
//       .populate({
//         path: 'district',
//         select: 'name branch',
//         match: { branch: userBranch }
//       })
//       .lean();

//     const filteredSales = sales.filter(s => s.district !== null);

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(16).text('Sales Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();

//     const tableTop = doc.y;
//     const colWidths = [150, 150, 150];

//     const headers = ['District', 'Date', 'Amount'];
//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });

//     let y = tableTop + 20;
//     let totalAmount = 0;

//     filteredSales.forEach((s) => {
//       const row = [s.district.name, moment(s.date).format('YYYY-MM-DD'), s.amount.toString()];
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
//       totalAmount += s.amount;
//       y += 20;
//     });

//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);
//     doc.rect(40 + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();
//     doc.text(totalAmount.toString(), 45 + colWidths[0] + colWidths[1], y + 5);

//     doc.end();
//   },

//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     // const userBranch = req.user.branch;

//     const user = JSON.parse(localStorage.getItem('user'));
// const userBranch = user?.branch;
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

//     const receipts = await Receipt.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } })
//       .populate({
//         path: 'district',
//         select: 'name branch',
//         match: { branch: userBranch }
//       })
//       .lean();

//     const filteredReceipts = receipts.filter(r => r.district !== null);

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(16).text('Receipts Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();

//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100];

//     const headers = ['District', 'Date', 'Cash', 'Bank', 'Online'];
//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });

//     let y = tableTop + 20;
//     let totalCash = 0, totalBank = 0, totalOnline = 0;

//     filteredReceipts.forEach((r) => {
//       const row = [
//         r.district.name,
//         moment(r.date).format('YYYY-MM-DD'),
//         r.cash.toString(),
//         r.bank.toString(),
//         r.online.toString()
//       ];

//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });

//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//       y += 20;
//     });

//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);

//     const totals = [totalCash, totalBank, totalOnline];
//     totals.forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(total.toString(), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });

//     doc.end();
//   }
// };

// module.exports = reportController;

//corrected one -----------------------
// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const moment = require('moment')

// const User = require('../models/User')


// const reportController = {
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }


//       const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//         .populate('district', 'name')
//         .lean();

//       const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//         .populate('district', 'name')
//         .lean();

//       const formattedSales = sales.map(s => ({
//         district: s.district,
//         date: s.date,
//         amount: s.amount
//       }));

//       const formattedReceipts = receipts.map(r => ({
//         district: r.district,
//         date: r.date,
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate('district', 'name')
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Amount']);

//     let totalAmount = 0;
//     sales.forEach(s => {
//       worksheet.addRow([s.district, s.date, s.amount]);
//       totalAmount += s.amount;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalAmount]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate('district', 'name')
//       .lean();

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);

//     let totalCash = 0, totalBank = 0, totalOnline = 0;
//     receipts.forEach(r => {
//       worksheet.addRow([r.district, r.date, r.cash, r.bank, r.online]);
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalBank, totalOnline]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`+".xlsx");
//     // res.setHeader('Content-Disposition', `attachment; filename="receipts-${startDate}_to_${endDate}.xlsx"`);


//     await workbook.xlsx.write(res);
//     res.end();
//   },



// downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
  
//     // Ensure correct date format for query and rendering
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
//     const sales = await Sale.find({
//       date: { $gte: formattedStartDate, $lte: formattedEndDate },
//     })
//       .populate('district', 'name')
//       .lean();
  
//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
  
//     doc.fontSize(16).text('Sales Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();
  
//     const tableTop = doc.y;
//     const colWidths = [150, 150, 150]; // District, Date, Amount
  
//     // Draw headers
//     const headers = ['District', 'Date', 'Amount'];
//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });
  
//     let y = tableTop + 20;
//     let totalAmount = 0;
  
//     sales.forEach((s) => {
//       const row = [s.district, moment(s.date).format('YYYY-MM-DD'), s.amount.toString()];  // Format date
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
//       totalAmount += s.amount;
//       y += 20;
//     });
  
//     // Total Row
//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);
//     doc.rect(40 + colWidths[0] + colWidths[1], y, colWidths[2], 20).stroke();
//     doc.text(totalAmount.toString(), 45 + colWidths[0] + colWidths[1], y + 5);
  
//     doc.end();
//   },


// downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
  
//     // Ensure correct date format for query and rendering
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
//     const receipts = await Receipt.find({
//       date: { $gte: formattedStartDate, $lte: formattedEndDate },
//     })
//       .populate('district', 'name')
//       .lean();
  
//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);
  
//     doc.fontSize(16).text('Receipts Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();
  
//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100]; // District, Date, Cash, Bank, Online
  
//     // Draw headers
//     const headers = ['District', 'Date', 'Cash', 'Bank', 'Online'];
//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });
  
//     let y = tableTop + 20;
//     let totalCash = 0, totalBank = 0, totalOnline = 0;
  
//     receipts.forEach((r) => {
//       const row = [
//         r.district,
//         moment(r.date).format('YYYY-MM-DD'),  // Format date
//         r.cash.toString(),
//         r.bank.toString(),
//         r.online.toString()
//       ];
  
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
  
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//       y += 20;
//     });
  
//     // Totals row
//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);
//     const totals = [totalCash, totalBank, totalOnline];
//     totals.forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(total.toString(), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });
  
//     doc.end();
//   }
// };

// module.exports = reportController;

// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const moment = require('moment');
// const User = require('../models/User');

// const reportController = {
    
//   getReports: async (req, res) => {
//     console.log("req.user in getReports:", req.user);

//     try {
//       const { startDate, endDate } = req.query;
//       const userBranch = req.user.branch;
      

//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

//       const sales = await Sale.find({
//         date: { $gte: startDate, $lte: endDate },
//       })
//         .populate({ path: 'district', select: 'name branch' })
//         .lean();

//       const receipts = await Receipt.find({
//         date: { $gte: startDate, $lte: endDate },
//       })
//         .populate({ path: 'district', select: 'name branch' })
//         .lean();

//       const filteredSales = sales.filter(s => s.district.branch.toString() === userBranch.toString());
//       const filteredReceipts = receipts.filter(r => r.district.branch.toString() === userBranch.toString());

//       const formattedSales = filteredSales.map(s => ({
//         district: s.district.name,
//         date: s.date,
//         cash: s.cash,
//         private: s.private,
//         gov: s.gov,
//       }));

//       const formattedReceipts = filteredReceipts.map(r => ({
//         district: r.district.name,
//         date: r.date,
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online,
//       }));

//       res.status(200).json({
//         sales: formattedSales,
//         receipts: formattedReceipts,
//       });
//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },

//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user.branch;

//     const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredSales = sales.filter(s => s.district.branch.toString() === userBranch.toString());

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Private', 'Gov']);

//     let totalCash = 0, totalPrivate = 0, totalGov = 0;
//     filteredSales.forEach(s => {
//       worksheet.addRow([s.district.name, s.date, s.cash, s.private, s.gov]);
//       totalCash += s.cash;
//       totalPrivate += s.private;
//       totalGov += s.gov;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user.branch;

//     const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredReceipts = receipts.filter(r => r.district.branch.toString() === userBranch.toString());

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);

//     let totalCash = 0, totalBank = 0, totalOnline = 0;
//     filteredReceipts.forEach(r => {
//       worksheet.addRow([r.district.name, r.date, r.cash, r.bank, r.online]);
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalBank, totalOnline]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user.branch;
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

//     const sales = await Sale.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredSales = sales.filter(s => s.district.branch.toString() === userBranch.toString());

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(16).text('Sales Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();

//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100];
//     const headers = ['District', 'Date', 'Cash', 'Private', 'Gov'];

//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });

//     let y = tableTop + 20;
//     let totalCash = 0, totalPrivate = 0, totalGov = 0;

//     filteredSales.forEach((s) => {
//       const row = [s.district.name, moment(s.date).format('YYYY-MM-DD'), s.cash.toString(), s.private.toString(), s.gov.toString()];
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
//       totalCash += s.cash;
//       totalPrivate += s.private;
//       totalGov += s.gov;
//       y += 20;
//     });

//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);

//     const totals = [totalCash, totalPrivate, totalGov];
//     totals.forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(total.toString(), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });

//     doc.end();
//   },

//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user.branch;
//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

//     const receipts = await Receipt.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredReceipts = receipts.filter(r => r.district.branch.toString() === userBranch.toString());

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(16).text('Receipts Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`);
//     doc.moveDown();

//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100];
//     const headers = ['District', 'Date', 'Cash', 'Bank', 'Online'];

//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });

//     let y = tableTop + 20;
//     let totalCash = 0, totalBank = 0, totalOnline = 0;

//     filteredReceipts.forEach((r) => {
//       const row = [r.district.name, moment(r.date).format('YYYY-MM-DD'), r.cash.toString(), r.bank.toString(), r.online.toString()];
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(text, 45 + i * colWidths[i], y + 5);
//       });
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//       y += 20;
//     });

//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);

//     const totals = [totalCash, totalBank, totalOnline];
//     totals.forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(total.toString(), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });

//     doc.end();
//   }
// };

// module.exports = reportController;

// const Sale = require('../models/Sale');
// const Receipt = require('../models/Receipt');
// const ExcelJS = require('exceljs');
// const PDFDocument = require('pdfkit');
// const moment = require('moment');
// const User = require('../models/User');
// const District = require('../models/District')
// // const Receipt = require('../models/Receipt')

// const reportController = {
//   getReports: async (req, res) => {
//     try {
//       const { startDate, endDate } = req.query;
//       const userBranch = req.user?.branch;
//       console.log(req.user)
//       if (!userBranch) {
//         return res.status(400).json({ error: 'User branch missing in token' });
//       }

//       if (!startDate || !endDate) {
//         return res.status(400).json({ error: 'Start and end dates are required' });
//       }

 
//     const allDistricts = await District.find().lean();

// const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).lean();
// sales.forEach(s => {
//   s.district = allDistricts.find(d => d.name === s.district);
// });


//     //   const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//     //     .populate({ path: 'district', select: 'name branch' })
//     //     .lean();

//     const allReceipts = await Receipt.find().lean();

//     const receipts = await Receipt.find({date : {$gte: startDate, $lte: endDate}}).lean();
//     receipts.forEach(s => {
//         s.district = allReceipts.find(d => d.name === s.district)
//     })

//         const filteredSales = sales.filter(s => s.district?.branch?.toString() === userBranch.toString());

//       const filteredReceipts = receipts.filter(r => r.district?.branch?.toString() === userBranch.toString());

//       const formattedSales = filteredSales.map(s => ({
//         district: s.district.name,
//         date: s.date,
//         cash: s.cash,
//         private: s.private,
//         gov: s.gov,
//       }));

//       const formattedReceipts = filteredReceipts.map(r => ({
//         district: r.district.name,
//         date: r.date,
//         cash: r.cash,
//         bank: r.bank,
//         online: r.online,
//       }));

//       console.log('Sales count:', filteredSales);
// console.log('Receipts count:', filteredReceipts);
// console.log('First sale district:', sales[0]?.district);
// console.log('User branch:', userBranch);

//       res.status(200).json({ sales: formattedSales, receipts: formattedReceipts });


//     } catch (error) {
//       console.error('Error fetching reports:', error);
//       res.status(500).json({ error: 'Failed to fetch reports' });
//     }
//   },



//   downloadSalesExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;
//     if (!userBranch) {
//       return res.status(400).json({ error: 'User branch missing in token' });
//     }

//     const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredSales = sales.filter(s => s.district?.branch?.toString() === userBranch.toString());

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sales Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Private', 'Gov']);

//     let totalCash = 0, totalPrivate = 0, totalGov = 0;
//     filteredSales.forEach(s => {
//       worksheet.addRow([s.district.name, s.date, s.cash, s.private, s.gov]);
//       totalCash += s.cash;
//       totalPrivate += s.private;
//       totalGov += s.gov;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;
//     if (!userBranch) {
//       return res.status(400).json({ error: 'User branch missing in token' });
//     }

//     const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredReceipts = receipts.filter(r => r.district?.branch?.toString() === userBranch.toString());

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Bank', 'Online']);

//     let totalCash = 0, totalBank = 0, totalOnline = 0;
//     filteredReceipts.forEach(r => {
//       worksheet.addRow([r.district.name, r.date, r.cash, r.bank, r.online]);
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//     });

//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalBank, totalOnline]);

//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },

//   downloadSalesPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;
//     if (!userBranch) {
//       return res.status(400).json({ error: 'User branch missing in token' });
//     }

//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

//     const sales = await Sale.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredSales = sales.filter(s => s.district?.branch?.toString() === userBranch.toString());

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();

//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100];
//     const headers = ['District', 'Date', 'Cash', 'Private', 'Gov'];

//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });

//     let y = tableTop + 20;
//     let totalCash = 0, totalPrivate = 0, totalGov = 0;

//     filteredSales.forEach((s) => {
//       const row = [s.district.name, moment(s.date).format('YYYY-MM-DD'), s.cash, s.private, s.gov];
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(String(text), 45 + i * colWidths[i], y + 5);
//       });
//       totalCash += s.cash;
//       totalPrivate += s.private;
//       totalGov += s.gov;
//       y += 20;
//     });

//     doc.font('Helvetica-Bold');
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);

//     [totalCash, totalPrivate, totalGov].forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });

//     doc.end();
//   },

//   downloadReceiptsPDF: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;
//     if (!userBranch) {
//       return res.status(400).json({ error: 'User branch missing in token' });
//     }

//     const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
//     const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

//     const receipts = await Receipt.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } })
//       .populate({ path: 'district', select: 'name branch' })
//       .lean();

//     const filteredReceipts = receipts.filter(r => r.district?.branch?.toString() === userBranch.toString());

//     const doc = new PDFDocument({ margin: 40 });
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
//     doc.pipe(res);

//     doc.fontSize(16).text('Receipts Report', { align: 'center' }).moveDown();
//     doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();

//     const tableTop = doc.y;
//     const colWidths = [100, 100, 100, 100, 100];
//     const headers = ['District', 'Date', 'Cash', 'Bank', 'Online'];

//     headers.forEach((h, i) => {
//       doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
//       doc.text(h, 45 + i * colWidths[i], tableTop + 5);
//     });

//     let y = tableTop + 20;
//     let totalCash = 0, totalBank = 0, totalOnline = 0;

//     filteredReceipts.forEach((r) => {
//       const row = [r.district.name, moment(r.date).format('YYYY-MM-DD'), r.cash, r.bank, r.online];
//       row.forEach((text, i) => {
//         doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
//         doc.text(String(text), 45 + i * colWidths[i], y + 5);
//       });
//       totalCash += r.cash;
//       totalBank += r.bank;
//       totalOnline += r.online;
//       y += 20;
//     });

//     doc.font('Helvetica-Bold'); 
//     doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
//     doc.text('Total', 45, y + 5);

//     [totalCash, totalBank, totalOnline].forEach((total, i) => {
//       doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
//       doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
//     });

//     doc.end();
//   }
// };

// module.exports = reportController;



const Sale = require('../models/Sale');
const Receipt = require('../models/Receipt');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment');
const District = require('../models/District');

const reportController = {
  getReports: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const userBranch = req.user?.branch;

      if (!userBranch) {
        return res.status(400).json({ error: 'User branch missing in token' });
      }

      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start and end dates are required' });
      }

      const allDistricts = await District.find().lean();

      const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).lean();
      sales.forEach(s => {
        s.district = allDistricts.find(d => d.name === s.district);
      });

      const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } }).lean();
      receipts.forEach(r => {
        r.district = allDistricts.find(d => d.name === r.district);
      });

      const filteredSales = sales.filter(s => s.district?.branch === userBranch);
      const filteredReceipts = receipts.filter(r => r.district?.branch === userBranch);

      const formattedSales = filteredSales.map(s => ({
        district: s.district.name,
        date: s.date,
        cash: s.cash,
        private: s.private,
        gov: s.gov,
      }));

      const formattedReceipts = filteredReceipts.map(r => ({
        district: r.district.name,
        date: r.date,
        cash: r.cash,
        private: r.private,
        gov: r.gov,
      }));

      console.log(filteredSales)
      console.log(filteredReceipts)

      res.status(200).json({ sales: filteredSales, receipts: filteredReceipts });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({ error: 'Failed to fetch reports' });
    }
  },

  downloadSalesExcel: async (req, res) => {
  const { startDate, endDate } = req.query;
  const userBranch = req.user?.branch;
  if (!userBranch) {
    return res.status(400).json({ error: 'User branch missing in token' });
  }

  const allDistricts = await District.find().lean();
  const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).lean();
  sales.forEach(s => {
    s.district = allDistricts.find(d => d.name === s.district?.toUpperCase());
  });
  const filteredSales = sales.filter(s => s.district?.branch === userBranch);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');
  worksheet.addRow(['District', 'Date', 'Cash', 'Private', 'Gov']);

  let totalCash = 0, totalPrivate = 0, totalGov = 0;
  filteredSales.forEach(s => {
    worksheet.addRow([s.district.name, s.date, s.cash, s.private, s.gov]);
    totalCash += s.cash;
    totalPrivate += s.private;
    totalGov += s.gov;
  });

  worksheet.addRow([]);
  worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov]);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
},


downloadReceiptsExcel: async (req, res) => {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;
    if (!userBranch) {
      return res.status(400).json({ error: 'User branch missing in token' });
    }
  
    const allDistricts = await District.find().lean();
    const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } }).lean();
    receipts.forEach(r => {
      r.district = allDistricts.find(d => d.name === r.district?.toUpperCase());
    });
    const filteredReceipts = receipts.filter(r => r.district?.branch === userBranch);
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Receipts Report');
    worksheet.addRow(['District', 'Date', 'Cash', 'Private', 'Gov']);
  
    let totalCash = 0, totalPrivate = 0, totalGov = 0;
    filteredReceipts.forEach(r => {
      worksheet.addRow([r.district.name, r.date, r.cash, r.private, r.gov]);
      totalCash += r.cash;
      totalPrivate += r.private;
      totalGov += r.gov;
    });
  
    worksheet.addRow([]);
    worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov]);
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
    await workbook.xlsx.write(res);
    res.end();
  },
  
  

  downloadSalesPDF: async (req, res) => {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;
    if (!userBranch) {
      return res.status(400).json({ error: 'User branch missing in token' });
    }
  
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
    const allDistricts = await District.find().lean();
    const sales = await Sale.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } }).lean();
    sales.forEach(s => {
      s.district = allDistricts.find(d => d.name === s.district?.toUpperCase());
    });
    const filteredSales = sales.filter(s => s.district?.branch === userBranch);
  
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
    doc.pipe(res);
  
    doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();
  
    const tableTop = doc.y;
    const colWidths = [100, 100, 100, 100, 100];
    const headers = ['District', 'Date', 'Cash', 'Private', 'Gov'];
  
    headers.forEach((h, i) => {
      doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
      doc.text(h, 45 + i * colWidths[i], tableTop + 5);
    });
  
    let y = tableTop + 20;
    let totalCash = 0, totalPrivate = 0, totalGov = 0;
  
    filteredSales.forEach((s) => {
      const row = [s.district.name, moment(s.date).format('YYYY-MM-DD'), s.cash, s.private, s.gov];
      row.forEach((text, i) => {
        doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
        doc.text(String(text), 45 + i * colWidths[i], y + 5);
      });
      totalCash += s.cash;
      totalPrivate += s.private;
      totalGov += s.gov;
      y += 20;
    });
  
    doc.font('Helvetica-Bold');
    doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
    doc.text('Total', 45, y + 5);
  
    [totalCash, totalPrivate, totalGov].forEach((total, i) => {
      doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
      doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
    });
  
    doc.end();
  },
  
  

  downloadReceiptsPDF: async (req, res) => {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;
    if (!userBranch) {
      return res.status(400).json({ error: 'User branch missing in token' });
    }
  
    const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
    const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
    const allDistricts = await District.find().lean();
    const receipts = await Receipt.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } }).lean();
    receipts.forEach(r => {
      r.district = allDistricts.find(d => d.name === r.district?.toUpperCase());
    });
    const filteredReceipts = receipts.filter(r => r.district?.branch === userBranch);
  
    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
    doc.pipe(res);
  
    doc.fontSize(16).text('Receipts Report', { align: 'center' }).moveDown();
    doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();
  
    const tableTop = doc.y;
    const colWidths = [100, 100, 100, 100, 100];
    const headers = ['District', 'Date', 'Cash', 'Private', 'Gov'];
  
    headers.forEach((h, i) => {
      doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
      doc.text(h, 45 + i * colWidths[i], tableTop + 5);
    });
  
    let y = tableTop + 20;
    let totalCash = 0, totalPrivate = 0, totalGov = 0;
  
    filteredReceipts.forEach((r) => {
      const row = [r.district.name, moment(r.date).format('YYYY-MM-DD'), r.cash, r.private, r.gov];
      row.forEach((text, i) => {
        doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
        doc.text(String(text), 45 + i * colWidths[i], y + 5);
      });
      totalCash += r.cash;
      totalPrivate += r.private;
      totalGov += r.gov;
      y += 20;
    });
  
    doc.font('Helvetica-Bold');
    doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
    doc.text('Total', 45, y + 5);
  
    [totalCash, totalPrivate, totalGov].forEach((total, i) => {
      doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
      doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
    });
  
    doc.end();
  
  }
};

module.exports = reportController;
