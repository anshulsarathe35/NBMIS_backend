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
const { generateDistrictwiseSalesOnlyPDF } = require('../utils/pdfGenerator');

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

  //newly added after district wise sale and receipts
  getDistrictWiseReports: async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;

    if (!userBranch) {
      return res.status(400).json({ error: 'User branch missing in token' });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }

    const allDistricts = await District.find({ branch: userBranch }).lean();

    const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).lean();
    const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } }).lean();

    // Map district name to branch (used for filtering)
    const districtMap = new Map();
    allDistricts.forEach(d => districtMap.set(d.name, d));

    const filteredSales = sales.filter(s => districtMap.has(s.district));
    const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

    // Aggregate sales by district
    const salesByDistrict = {};
    filteredSales.forEach(s => {
      const districtName = s.district;
      if (!salesByDistrict[districtName]) {
        salesByDistrict[districtName] = { district: districtName, cash: 0, private: 0, gov: 0 };
      }
      salesByDistrict[districtName].cash += s.cash;
      salesByDistrict[districtName].private += s.private;
      salesByDistrict[districtName].gov += s.gov;
    });

    // Aggregate receipts by district
    const receiptsByDistrict = {};
    filteredReceipts.forEach(r => {
      const districtName = r.district;
      if (!receiptsByDistrict[districtName]) {
        receiptsByDistrict[districtName] = { district: districtName, cash: 0, private: 0, gov: 0 };
      }
      receiptsByDistrict[districtName].cash += r.cash;
      receiptsByDistrict[districtName].private += r.private;
      receiptsByDistrict[districtName].gov += r.gov;
    });

    const salesData = Object.values(salesByDistrict);
    const receiptsData = Object.values(receiptsByDistrict);

    // console.log(salesData);
    // console.log(receiptsData)

    res.status(200).json({
      sales: salesData,
      receipts: receiptsData
    });

  } catch (error) {
    console.error('Error fetching district-wise reports:', error);
    res.status(500).json({ error: 'Failed to fetch district-wise reports' });
  }
}
,

//   downloadSalesExcel: async (req, res) => {
//   const { startDate, endDate } = req.query;
//   const userBranch = req.user?.branch;
//   if (!userBranch) {
//     return res.status(400).json({ error: 'User branch missing in token' });
//   }

//   const allDistricts = await District.find().lean();
//   const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).lean();
//   sales.forEach(s => {
//     s.district = allDistricts.find(d => d.name === s.district?.toUpperCase());
//   });
//   const filteredSales = sales.filter(s => s.district?.branch === userBranch);

//   const workbook = new ExcelJS.Workbook();
//   const worksheet = workbook.addWorksheet('Sales Report');
//   worksheet.addRow(['District', 'Date', 'Cash', 'Private', 'Gov']);

//   let totalCash = 0, totalPrivate = 0, totalGov = 0;
//   filteredSales.forEach(s => {
//     worksheet.addRow([s.district.name, s.date, s.cash, s.private, s.gov]);
//     totalCash += s.cash;
//     totalPrivate += s.private;
//     totalGov += s.gov;
//   });

//   worksheet.addRow([]);
//   worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov]);

//   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//   res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
//   await workbook.xlsx.write(res);
//   res.end();
// },
downloadSalesExcel: async (req, res) => {
  const { startDate, endDate } = req.query;
  const userBranch = req.user?.branch;
  if (!userBranch) {
    return res.status(400).json({ error: 'User branch missing in token' });
  }

  const allDistricts = await District.find().lean();
  const sales = await Sale.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }).lean();
  sales.forEach(s => {
    s.district = allDistricts.find(d => d.name === s.district?.toUpperCase());
  });
  const filteredSales = sales.filter(s => s.district?.branch === userBranch);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'District', key: 'district', width: 20 },
    { header: 'Cash', key: 'cash', width: 15 },
    { header: 'Private', key: 'private', width: 15 },
    { header: 'Gov', key: 'gov', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  let totalCash = 0, totalPrivate = 0, totalGov = 0, grandTotal = 0;
  let prevDate = null;

  filteredSales.forEach(s => {
    const formattedDate = new Date(s.date).toLocaleDateString('en-IN');
    const rowTotal = s.cash + s.private + s.gov;

    worksheet.addRow([
      prevDate === formattedDate ? '' : formattedDate,
      s.district.name,
      s.cash,
      s.private,
      s.gov,
      rowTotal,
    ]);

    prevDate = formattedDate;
    totalCash += s.cash;
    totalPrivate += s.private;
    totalGov += s.gov;
    grandTotal += rowTotal;
  });

  worksheet.addRow([]);
  const totalRow = worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov, grandTotal]);
  totalRow.font = { bold: true };

  worksheet.getRow(1).font = { bold: true };

  worksheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
},


// downloadReceiptsExcel: async (req, res) => {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;
//     if (!userBranch) {
//       return res.status(400).json({ error: 'User branch missing in token' });
//     }
  
//     const allDistricts = await District.find().lean();
//     const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } }).lean();
//     receipts.forEach(r => {
//       r.district = allDistricts.find(d => d.name === r.district?.toUpperCase());
//     });
//     const filteredReceipts = receipts.filter(r => r.district?.branch === userBranch);
  
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Receipts Report');
//     worksheet.addRow(['District', 'Date', 'Cash', 'Private', 'Gov']);
  
//     let totalCash = 0, totalPrivate = 0, totalGov = 0;
//     filteredReceipts.forEach(r => {
//       worksheet.addRow([r.district.name, r.date, r.cash, r.private, r.gov]);
//       totalCash += r.cash;
//       totalPrivate += r.private;
//       totalGov += r.gov;
//     });
  
//     worksheet.addRow([]);
//     worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov]);
  
//     res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
//     await workbook.xlsx.write(res);
//     res.end();
//   },
downloadReceiptsExcel: async (req, res) => {
  const { startDate, endDate } = req.query;
  const userBranch = req.user?.branch;
  if (!userBranch) {
    return res.status(400).json({ error: 'User branch missing in token' });
  }

  const allDistricts = await District.find().lean();
  const receipts = await Receipt.find({ date: { $gte: startDate, $lte: endDate } }).sort({ date: 1 }).lean();
  receipts.forEach(r => {
    r.district = allDistricts.find(d => d.name === r.district?.toUpperCase());
  });
  const filteredReceipts = receipts.filter(r => r.district?.branch === userBranch);

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Receipts Report');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'District', key: 'district', width: 20 },
    { header: 'Cash', key: 'cash', width: 15 },
    { header: 'Private', key: 'private', width: 15 },
    { header: 'Gov', key: 'gov', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  let totalCash = 0, totalPrivate = 0, totalGov = 0, grandTotal = 0;
  let prevDate = null;

  filteredReceipts.forEach(r => {
    const formattedDate = new Date(r.date).toLocaleDateString('en-IN');
    const rowTotal = r.cash + r.private + r.gov;

    worksheet.addRow([
      prevDate === formattedDate ? '' : formattedDate,
      r.district.name,
      r.cash,
      r.private,
      r.gov,
      rowTotal,
    ]);

    prevDate = formattedDate;
    totalCash += r.cash;
    totalPrivate += r.private;
    totalGov += r.gov;
    grandTotal += rowTotal;
  });

  worksheet.addRow([]);
  const totalRow = worksheet.addRow(['', 'Total', totalCash, totalPrivate, totalGov, grandTotal]);
  totalRow.font = { bold: true };

  worksheet.getRow(1).font = { bold: true };

  worksheet.eachRow({ includeEmpty: false }, row => {
    row.eachCell(cell => {
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
},
  
  

  // downloadSalesPDF: async (req, res) => {
  //   const { startDate, endDate } = req.query;
  //   const userBranch = req.user?.branch;
  //   if (!userBranch) {
  //     return res.status(400).json({ error: 'User branch missing in token' });
  //   }
  
  //   const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  //   const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
  //   const allDistricts = await District.find().lean();
  //   const sales = await Sale.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } }).lean();
  //   sales.forEach(s => {
  //     s.district = allDistricts.find(d => d.name === s.district?.toUpperCase());
  //   });
  //   const filteredSales = sales.filter(s => s.district?.branch === userBranch);
  
  //   const doc = new PDFDocument({ margin: 40 });
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
  //   doc.pipe(res);
  
  //   doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown();
  //   doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();
  
  //   const tableTop = doc.y;
  //   const colWidths = [100, 100, 100, 100, 100];
  //   const headers = ['District', 'Date', 'Cash', 'Private', 'Gov'];
  
  //   headers.forEach((h, i) => {
  //     doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
  //     doc.text(h, 45 + i * colWidths[i], tableTop + 5);
  //   });
  
  //   let y = tableTop + 20;
  //   let totalCash = 0, totalPrivate = 0, totalGov = 0;
  
  //   filteredSales.forEach((s) => {
  //     const row = [s.district.name, moment(s.date).format('YYYY-MM-DD'), s.cash, s.private, s.gov];
  //     row.forEach((text, i) => {
  //       doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
  //       doc.text(String(text), 45 + i * colWidths[i], y + 5);
  //     });
  //     totalCash += s.cash;
  //     totalPrivate += s.private;
  //     totalGov += s.gov;
  //     y += 20;
  //   });
  
  //   doc.font('Helvetica-Bold');
  //   doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
  //   doc.text('Total', 45, y + 5);
  
  //   [totalCash, totalPrivate, totalGov].forEach((total, i) => {
  //     doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
  //     doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
  //   });
  
  //   doc.end();
  // },
  downloadSalesPDF: async (req, res) => {
  const { startDate, endDate } = req.query;
  const userBranch = req.user?.branch;

  if (!userBranch) {
    return res.status(400).json({ error: 'User branch missing in token' });
  }

  const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

  const allDistricts = await District.find().lean();
  const sales = await Sale.find({
    date: { $gte: formattedStartDate, $lte: formattedEndDate }
  }).lean();

  sales.forEach(s => {
    s.district = allDistricts.find(d => d.name === s.district?.toUpperCase());
  });

  const filteredSales = sales.filter(s => s.district?.branch === userBranch);

  // Sort by date then district
  filteredSales.sort((a, b) => {
    const dateCmp = new Date(a.date) - new Date(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.district.name.localeCompare(b.district.name);
  });

  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=sales-${startDate}_to_${endDate}.pdf`);
  doc.pipe(res);

  doc.fontSize(16).text('Sales Report', { align: 'center' }).moveDown();
  // doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();
  doc.fontSize(12).text(`Date Range: ${moment(startDate).format('DD-MM-YYYY')} to ${moment(endDate).format('DD-MM-YYYY')}`).moveDown();


  const tableTop = doc.y + 10;
  const rowHeight = 22;
  const columnWidths = [80, 100, 80, 80, 80, 80]; // Date, District, Cash, Private, Gov, Total
  const columns = ['Date', 'District', 'Cash', 'Private', 'Gov', 'Total'];
  const xStart = 40;

  // Draw table headers
  doc.font('Helvetica-Bold');
  let x = xStart;
  columns.forEach((col, i) => {
    doc.rect(x, tableTop, columnWidths[i], rowHeight).stroke();
    doc.text(col, x + 5, tableTop + 6);
    x += columnWidths[i];
  });

  // Table rows
  let y = tableTop + rowHeight;
  let lastDate = '';
  let totalCash = 0, totalPrivate = 0, totalGov = 0;

  doc.font('Helvetica');
  filteredSales.forEach((sale) => {
    const currentDate = moment(sale.date).format('DD-MM-YYYY');

    const displayDate = currentDate !== lastDate ? currentDate : '';
    const total = (sale.cash || 0) + (sale.private || 0) + (sale.gov || 0);

    

    const row = [
      displayDate,
      sale.district.name,
      (sale.cash || 0).toFixed(2),
      (sale.private || 0).toFixed(2),
      (sale.gov || 0).toFixed(2),
      total.toFixed(2)
    ];

    x = xStart;
    row.forEach((cell, i) => {
      doc.rect(x, y, columnWidths[i], rowHeight).stroke();
      doc.text(cell, x + 5, y + 6);
      x += columnWidths[i];
    });

    totalCash += sale.cash || 0;
    totalPrivate += sale.private || 0;
    totalGov += sale.gov || 0;
    lastDate = currentDate;
    y += rowHeight;

    if (y + rowHeight > doc.page.height - 50) {
      doc.addPage();
      y = 40;

      // Redraw headers on new page
      doc.font('Helvetica-Bold');
      x = xStart;
      columns.forEach((col, i) => {
        doc.rect(x, y, columnWidths[i], rowHeight).stroke();
        doc.text(col, x + 5, y + 6);
        x += columnWidths[i];
      });
      y += rowHeight;
      doc.font('Helvetica');
    }
  });

  // Grand Total Row
  doc.font('Helvetica-Bold');
  const grandTotal = (totalCash + totalPrivate + totalGov).toFixed(2);
  const totals = [
    '', 'Grand Total',
    totalCash.toFixed(2),
    totalPrivate.toFixed(2),
    totalGov.toFixed(2),
    grandTotal
  ];

  x = xStart;
  totals.forEach((cell, i) => {
    doc.rect(x, y, columnWidths[i], rowHeight).stroke();
    doc.text(cell, x + 5, y + 6);
    x += columnWidths[i];
  });

  doc.end();
},
  
  

  // downloadReceiptsPDF: async (req, res) => {
  //   const { startDate, endDate } = req.query;
  //   const userBranch = req.user?.branch;
  //   if (!userBranch) {
  //     return res.status(400).json({ error: 'User branch missing in token' });
  //   }
  
  //   const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  //   const formattedEndDate = moment(endDate).format('YYYY-MM-DD');
  
  //   const allDistricts = await District.find().lean();
  //   const receipts = await Receipt.find({ date: { $gte: formattedStartDate, $lte: formattedEndDate } }).lean();
  //   receipts.forEach(r => {
  //     r.district = allDistricts.find(d => d.name === r.district?.toUpperCase());
  //   });
  //   const filteredReceipts = receipts.filter(r => r.district?.branch === userBranch);
  
  //   const doc = new PDFDocument({ margin: 40 });
  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
  //   doc.pipe(res);
  
  //   doc.fontSize(16).text('Receipts Report', { align: 'center' }).moveDown();
  //   doc.fontSize(12).text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`).moveDown();
  
  //   const tableTop = doc.y;
  //   const colWidths = [100, 100, 100, 100, 100];
  //   const headers = ['District', 'Date', 'Cash', 'Private', 'Gov'];
  
  //   headers.forEach((h, i) => {
  //     doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
  //     doc.text(h, 45 + i * colWidths[i], tableTop + 5);
  //   });
  
  //   let y = tableTop + 20;
  //   let totalCash = 0, totalPrivate = 0, totalGov = 0;
  
  //   filteredReceipts.forEach((r) => {
  //     const row = [r.district.name, moment(r.date).format('YYYY-MM-DD'), r.cash, r.private, r.gov];
  //     row.forEach((text, i) => {
  //       doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
  //       doc.text(String(text), 45 + i * colWidths[i], y + 5);
  //     });
  //     totalCash += r.cash;
  //     totalPrivate += r.private;
  //     totalGov += r.gov;
  //     y += 20;
  //   });
  
  //   doc.font('Helvetica-Bold');
  //   doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
  //   doc.text('Total', 45, y + 5);
  
  //   [totalCash, totalPrivate, totalGov].forEach((total, i) => {
  //     doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
  //     doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
  //   });
  
  //   doc.end();
  
  // },
  downloadReceiptsPDF: async (req, res) => {
  const { startDate, endDate } = req.query;
  const userBranch = req.user?.branch;
  if (!userBranch) {
    return res.status(400).json({ error: 'User branch missing in token' });
  }

  const formattedStartDate = moment(startDate).format('YYYY-MM-DD');
  const formattedEndDate = moment(endDate).format('YYYY-MM-DD');

  const allDistricts = await District.find().lean();
  const receipts = await Receipt.find({
    date: { $gte: formattedStartDate, $lte: formattedEndDate }
  }).lean();

  receipts.forEach(r => {
    r.district = allDistricts.find(d => d.name === r.district?.toUpperCase());
  });

  const filteredReceipts = receipts
    .filter(r => r.district?.branch === userBranch)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=receipts-${startDate}_to_${endDate}.pdf`);
  doc.pipe(res);

  doc.fontSize(16).text('Receipts Report', { align: 'center' }).moveDown();
  doc.fontSize(12).text(
    `Date Range: ${moment(startDate).format('DD-MM-YYYY')} to ${moment(endDate).format('DD-MM-YYYY')}`
  ).moveDown();

  const tableTop = doc.y;
  const colWidths = [100, 100, 100, 100, 100];
  const headers = ['Date', 'District', 'Cash', 'Private', 'Gov'];

  // Header row
  headers.forEach((h, i) => {
    doc.rect(40 + i * colWidths[i], tableTop, colWidths[i], 20).stroke();
    doc.text(h, 45 + i * colWidths[i], tableTop + 5);
  });

  let y = tableTop + 20;
  let totalCash = 0, totalPrivate = 0, totalGov = 0;
  let lastDate = null;

  filteredReceipts.forEach(r => {
    const currentDate = moment(r.date).format('DD-MM-YYYY');
    const displayDate = currentDate !== lastDate ? currentDate : '';
    const row = [displayDate, r.district.name, r.cash, r.private, r.gov];

    row.forEach((text, i) => {
      doc.rect(40 + i * colWidths[i], y, colWidths[i], 20).stroke();
      doc.text(String(text), 45 + i * colWidths[i], y + 5);
    });

    lastDate = currentDate;
    totalCash += r.cash;
    totalPrivate += r.private;
    totalGov += r.gov;
    y += 20;
  });

  // Total row
  doc.font('Helvetica-Bold');
  doc.rect(40, y, colWidths[0] + colWidths[1], 20).stroke();
  doc.text('Total', 45, y + 5);

  [totalCash, totalPrivate, totalGov].forEach((total, i) => {
    doc.rect(40 + colWidths[0] + colWidths[1] + i * colWidths[2], y, colWidths[2], 20).stroke();
    doc.text(String(total), 45 + colWidths[0] + colWidths[1] + i * colWidths[2], y + 5);
  });

  doc.end();
},

 

// downloadDistrictwiseSalesPdf: async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;

//     if (!userBranch) {
//       return res.status(400).send("User branch missing in token");
//     }

//     if (!startDate || !endDate) {
//       return res.status(400).send("Start and end dates are required");
//     }

//     const from = new Date(startDate);
//     const to = new Date(endDate);
//     to.setHours(23, 59, 59, 999);

//     // Get all districts under user's branch
//     const allDistricts = await District.find({ branch: userBranch }).lean();
//     const validDistricts = new Set(allDistricts.map(d => d.name));

//     // Fetch sales in date range
//     const sales = await Sale.find({ date: { $gte: from, $lte: to } }).lean();

//     // Filter only sales for this user's branch's districts
//     const filteredSales = sales.filter(s => validDistricts.has(s.district));

//     const districtWiseTotals = {};
//     let grandCash = 0, grandPrivate = 0, grandGov = 0;

//     filteredSales.forEach(s => {
//       const districtName = s.district;
//       if (!districtWiseTotals[districtName]) {
//         districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0 };
//       }
//       districtWiseTotals[districtName].cash += s.cash || 0;
//       districtWiseTotals[districtName].private += s.private || 0;
//       districtWiseTotals[districtName].gov += s.gov || 0;

//       grandCash += s.cash || 0;
//       grandPrivate += s.private || 0;
//       grandGov += s.gov || 0;
//     });

//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=districtwise_sales.pdf");
//     doc.pipe(res);

//     doc.fontSize(18).text("District-wise Sales Report", { align: "center" }).moveDown();

//     const startX = 50;
//     let y = doc.y;

//     // Table header
//     doc.fontSize(12).text("District", startX, y);
//     doc.text("Cash (₹)", startX + 120, y);
//     doc.text("Private (₹)", startX + 210, y);
//     doc.text("Gov (₹)", startX + 310, y);
//     doc.text("Total (₹)", startX + 400, y);
//     y += 20;
//     doc.moveTo(startX, y - 5).lineTo(startX + 480, y - 5).stroke();

//     // Table rows
//     for (const [district, { cash, private: priv, gov }] of Object.entries(districtWiseTotals)) {
//       if (y > doc.page.height - 50) {
//         doc.addPage();
//         y = 50;
//         doc.fontSize(12).text("District", startX, y);
//         doc.text("Cash (₹)", startX + 120, y);
//         doc.text("Private (₹)", startX + 210, y);
//         doc.text("Gov (₹)", startX + 310, y);
//         doc.text("Total (₹)", startX + 400, y);
//         y += 20;
//         doc.moveTo(startX, y - 5).lineTo(startX + 480, y - 5).stroke();
//       }

//       const total = cash + priv + gov;
//       doc.text(district, startX, y);
//       doc.text(cash.toFixed(2), startX + 120, y);
//       doc.text(priv.toFixed(2), startX + 210, y);
//       doc.text(gov.toFixed(2), startX + 310, y);
//       doc.text(total.toFixed(2), startX + 400, y);
//       y += 20;
//     }

//     // Grand Total
//     if (y > doc.page.height - 50) {
//       doc.addPage();
//       y = 50;
//     }
//     const grandTotal = grandCash + grandPrivate + grandGov;
//     doc.moveTo(startX, y + 5).lineTo(startX + 480, y + 5).stroke();
//     y += 20;
//     doc.font("Helvetica-Bold");
//     doc.text("Grand Total", startX, y);
//     doc.text(grandCash.toFixed(2), startX + 120, y);
//     doc.text(grandPrivate.toFixed(2), startX + 210, y);
//     doc.text(grandGov.toFixed(2), startX + 310, y);
//     doc.text(grandTotal.toFixed(2), startX + 400, y);
//     doc.font("Helvetica");

//     doc.end();
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// }
// downloadDistrictwiseSalesPdf: async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;

//     if (!userBranch || !startDate || !endDate) {
//       return res.status(400).send("Required parameters missing");
//     }

//     const allDistricts = await District.find({ branch: userBranch }).lean();
//     const districtMap = new Map(allDistricts.map(d => [d.name, d]));

//     const sales = await Sale.find({ date: { $gte: new Date(startDate), $lte: new Date(endDate) } }).lean();

//     const filteredSales = sales.filter(s => districtMap.has(s.district));

//     // if (!filteredSales.length) {
//     //   return res.status(404).send("No sales data found for selected period");
//     // }

//     // Aggregate sales by district (cash, private, gov)
//     const salesByDistrict = {};
//     filteredSales.forEach(s => {
//       if (!salesByDistrict[s.district]) {
//         salesByDistrict[s.district] = { cash: 0, private: 0, gov: 0 };
//       }
//       salesByDistrict[s.district].cash += s.cash || 0;
//       salesByDistrict[s.district].private += s.private || 0;
//       salesByDistrict[s.district].gov += s.gov || 0;
//     });

//     const pdfBuffer = await generateDistrictwiseSalesOnlyPDF(salesByDistrict);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=districtwise_sales.pdf");
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error generating PDF");
//   }
// }
downloadDistrictwiseSalesPdf: async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;

    if (!userBranch || !startDate || !endDate) {
      return res.status(400).send("Required parameters missing");
    }

    const allDistricts = await District.find({ branch: userBranch }).lean();
    const districtMap = new Map(allDistricts.map(d => [d.name, d]));

    const sales = await Sale.find({ 
      date: { $gte: startDate, $lte: endDate } 
    }).lean();

    const filteredSales = sales.filter(s => districtMap.has(s.district));

    const salesByDistrict = {};
    let grandTotals = { cash: 0, private: 0, gov: 0, total: 0 };

    filteredSales.forEach(s => {
      const d = s.district;
      if (!salesByDistrict[d]) {
        salesByDistrict[d] = { cash: 0, private: 0, gov: 0, total: 0 };
      }
      const cash = s.cash || 0;
      const privateAmt = s.private || 0;
      const gov = s.gov || 0;
      const total = cash + privateAmt + gov;

      salesByDistrict[d].cash += cash;
      salesByDistrict[d].private += privateAmt;
      salesByDistrict[d].gov += gov;
      salesByDistrict[d].total += total;

      grandTotals.cash += cash;
      grandTotals.private += privateAmt;
      grandTotals.gov += gov;
      grandTotals.total += total;
    });

    // Create PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=districtwise_sales.pdf");
      res.send(pdfBuffer);
    });

    // === Header Section ===
    doc.fontSize(16).font("Helvetica-Bold").text("District-wise Sales Report", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica-Bold").text(`Branch: `, { continued: true }).font("Helvetica").text(userBranch);
    doc.font("Helvetica-Bold").text(`Start Date: `, { continued: true }).font("Helvetica").text(new Date(startDate).toLocaleDateString("en-IN"));
    doc.font("Helvetica-Bold").text(`End Date: `, { continued: true }).font("Helvetica").text(new Date(endDate).toLocaleDateString("en-IN"));
    doc.moveDown(1);

    // === Table Setup ===
    const colWidths = [150, 80, 80, 80, 80];
    const headers = ["District", "Cash", "Private", "Gov", "Total"];
    const startX = doc.x;
    let y = doc.y;
    const rowHeight = 20;

    const drawRow = (values, isHeader = false) => {
      let x = startX;
      values.forEach((val, idx) => {
        doc.rect(x, y, colWidths[idx], rowHeight).stroke();
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
           .fontSize(11)
           .text(val, x + 5, y + 5, { width: colWidths[idx] - 10, align: idx === 0 ? 'left' : 'right' });
        x += colWidths[idx];
      });
      y += rowHeight;

      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 40;
      }
    };

    // === Table Header ===
    drawRow(headers, true);

    // === Table Body ===
    Object.entries(salesByDistrict).forEach(([district, totals]) => {
      drawRow([
        district,
        totals.cash.toFixed(2),
        totals.private.toFixed(2),
        totals.gov.toFixed(2),
        totals.total.toFixed(2)
      ]);
    });

    // === Grand Total Row ===
    drawRow([
      "Grand Total",
      grandTotals.cash.toFixed(2),
      grandTotals.private.toFixed(2),
      grandTotals.gov.toFixed(2),
      grandTotals.total.toFixed(2)
    ], true);

    doc.end();
  } catch (error) {
    console.error("Error generating district-wise sales PDF:", error);
    res.status(500).send("Error generating PDF");
  }
}
,

// downloadDistrictwiseSalesExcel : async (req, res) => {
//   try {
//     const { startDate, endDate, branchId } = req.body;
//     const from = new Date(startDate);
//     const to = new Date(endDate);

//     const sales = await Sale.find({
//       date: { $gte: from, $lte: to },
//       ...(branchId && { branch: branchId }),
//     })
//       .populate("district")
//       .populate("user");

//     const districtWiseTotals = {};

//     sales.forEach((sale) => {
//       const districtName = sale.district?.name || "Unknown";
//       if (!districtWiseTotals[districtName]) {
//         districtWiseTotals[districtName] = 0;
//       }
//       districtWiseTotals[districtName] += sale.amount;
//     });

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("District-wise Sales");

//     worksheet.columns = [
//       { header: "District", key: "district", width: 30 },
//       { header: "Amount", key: "amount", width: 15 },
//     ];

//     Object.entries(districtWiseTotals).forEach(([district, amount]) => {
//       worksheet.addRow({ district, amount });
//     });

//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.setHeader("Content-Disposition", "attachment; filename=sales.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error generating Excel");
//   }
// },downloadDistrictwiseReceiptsPdf : async (req, res) => {
//   try {
//     const { startDate, endDate, branchId } = req.body;
//     const from = new Date(startDate);
//     const to = new Date(endDate);

//     const receipts = await Receipt.find({
//       date: { $gte: from, $lte: to },
//       ...(branchId && { branch: branchId }),
//     })
//       .populate("district")
//       .populate("user");

//     const districtWiseTotals = {};

//     receipts.forEach((receipt) => {
//       const districtName = receipt.district?.name || "Unknown";
//       if (!districtWiseTotals[districtName]) {
//         districtWiseTotals[districtName] = { cash: 0, online: 0, bank: 0 };
//       }
//       districtWiseTotals[districtName].cash += receipt.cash;
//       districtWiseTotals[districtName].online += receipt.online;
//       districtWiseTotals[districtName].bank += receipt.bank;
//     });

//     const doc = new PDFDocument();
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", "attachment; filename=receipts.pdf");
//     doc.pipe(res);

//     doc.fontSize(16).text("District-wise Receipts Report", { align: "center" }).moveDown();
//     Object.entries(districtWiseTotals).forEach(([district, { cash, online, bank }]) => {
//       doc.fontSize(12).text(`${district}: Cash ₹${cash.toFixed(2)}, Online ₹${online.toFixed(2)}, Bank ₹${bank.toFixed(2)}`);
//     });

//     doc.end();
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error generating PDF");
//   }
// },downloadDistrictwiseReceiptsExcel : async (req, res) => {
//   try {
//     const { startDate, endDate, branchId } = req.body;
//     const from = new Date(startDate);
//     const to = new Date(endDate);

//     const receipts = await Receipt.find({
//       date: { $gte: from, $lte: to },
//       ...(branchId && { branch: branchId }),
//     })
//       .populate("district")
//       .populate("user");

//     const districtWiseTotals = {};

//     receipts.forEach((receipt) => {
//       const districtName = receipt.district?.name || "Unknown";
//       if (!districtWiseTotals[districtName]) {
//         districtWiseTotals[districtName] = { cash: 0, online: 0, bank: 0 };
//       }
//       districtWiseTotals[districtName].cash += receipt.cash;
//       districtWiseTotals[districtName].online += receipt.online;
//       districtWiseTotals[districtName].bank += receipt.bank;
//     });

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("District-wise Receipts");

//     worksheet.columns = [
//       { header: "District", key: "district", width: 30 },
//       { header: "Cash", key: "cash", width: 15 },
//       { header: "Online", key: "online", width: 15 },
//       { header: "Bank", key: "bank", width: 15 },
//     ];

//     Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//       worksheet.addRow({
//         district,
//         cash: totals.cash,
//         online: totals.online,
//         bank: totals.bank,
//       });
//     });

//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
//     res.setHeader("Content-Disposition", "attachment; filename=receipts.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error generating Excel");
//   }
// }
// downloadDistrictwiseSalesExcel: async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;

//     if (!userBranch || !startDate || !endDate) {
//       return res.status(400).send("Required parameters missing");
//     }

//     const allDistricts = await District.find({ branch: userBranch }).lean();
//     const districtMap = new Map(allDistricts.map(d => [d.name, d]));

//     const sales = await Sale.find({
//       date: { $gte: startDate, $lte: endDate }
//     }).lean();

//     const filteredSales = sales.filter(s => districtMap.has(s.district));

//     const districtWiseTotals = {};
//     filteredSales.forEach(sale => {
//       const districtName = sale.district;
//       districtWiseTotals[districtName] = (districtWiseTotals[districtName] || 0) + (sale.amount || 0);
//     });

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("District-wise Sales");

//     worksheet.columns = [
//       { header: "District", key: "district", width: 30 },
//       { header: "Amount", key: "amount", width: 15 },
//     ];

//     Object.entries(districtWiseTotals).forEach(([district, amount]) => {
//       worksheet.addRow({ district, amount: amount.toFixed(2) });
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=districtwise_sales.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error("Error generating district-wise sales Excel:", error);
//     res.status(500).send("Error generating Excel");
//   }
// }
downloadDistrictwiseSalesExcel: async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;

    if (!userBranch || !startDate || !endDate) {
      return res.status(400).send("Required parameters missing");
    }

    const allDistricts = await District.find({ branch: userBranch }).lean();
    const districtMap = new Map(allDistricts.map(d => [d.name, d]));

    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    const filteredSales = sales.filter(s => districtMap.has(s.district));

    const districtWiseTotals = {};
    const grandTotal = { cash: 0, private: 0, gov: 0, total: 0 };

    filteredSales.forEach(sale => {
      const district = sale.district;
      const cash = sale.cash || 0;
      const privateAmt = sale.private || 0;
      const gov = sale.gov || 0;
      const total = cash + privateAmt + gov;

      if (!districtWiseTotals[district]) {
        districtWiseTotals[district] = { cash: 0, private: 0, gov: 0, total: 0 };
      }

      districtWiseTotals[district].cash += cash;
      districtWiseTotals[district].private += privateAmt;
      districtWiseTotals[district].gov += gov;
      districtWiseTotals[district].total += total;

      grandTotal.cash += cash;
      grandTotal.private += privateAmt;
      grandTotal.gov += gov;
      grandTotal.total += total;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("District-wise Sales");

    // === Header Info (Center-Aligned, Bold) ===
    const headerStyle = {
      alignment: { horizontal: "center" },
      font: { bold: true },
    };

    const formattedStartDate = new Date(startDate).toLocaleDateString("en-IN");
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-IN");

    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = `Branch: ${userBranch}`;
    worksheet.getCell("A1").style = headerStyle;

    worksheet.mergeCells("A2:E2");
    worksheet.getCell("A2").value = `Start Date: ${formattedStartDate}`;
    worksheet.getCell("A2").style = headerStyle;

    worksheet.mergeCells("A3:E3");
    worksheet.getCell("A3").value = `End Date: ${formattedEndDate}`;
    worksheet.getCell("A3").style = headerStyle;

    worksheet.addRow([]); // Blank row after header

    // === Manually Add Table Headings Row ===
    const tableHeaderRow = worksheet.addRow(["District", "Cash", "Private", "Gov", "Total"]);
    tableHeaderRow.font = { bold: true };

    // === Add Sales Data ===
    Object.entries(districtWiseTotals).forEach(([district, data]) => {
      worksheet.addRow([
        district,
        data.cash.toFixed(2),
        data.private.toFixed(2),
        data.gov.toFixed(2),
        data.total.toFixed(2),
      ]);
    });

    // === Grand Total Row ===
    const grandRow = worksheet.addRow([
      "Grand Total",
      grandTotal.cash.toFixed(2),
      grandTotal.private.toFixed(2),
      grandTotal.gov.toFixed(2),
      grandTotal.total.toFixed(2),
    ]);
    grandRow.font = { bold: true };

    // === Set Column Widths ===
    worksheet.columns = [
      { key: "district", width: 30 },
      { key: "cash", width: 15 },
      { key: "private", width: 15 },
      { key: "gov", width: 15 },
      { key: "total", width: 15 },
    ];

    // === Send File ===
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=districtwise_sales.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating district-wise sales Excel:", error);
    res.status(500).send("Error generating Excel");
  }
}
,

// downloadDistrictwiseReceiptsPdf: async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;

//     if (!userBranch || !startDate || !endDate) {
//       return res.status(400).send("Required parameters missing");
//     }

//     const allDistricts = await District.find({ branch: userBranch }).lean();
//     const districtMap = new Map(allDistricts.map(d => [d.name, d]));

//     const receipts = await Receipt.find({
//       date: { $gte: startDate, $lte: endDate }
//     }).lean();

//     const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

//     const districtWiseTotals = {};
//     filteredReceipts.forEach(receipt => {
//       const districtName = receipt.district;
//       if (!districtWiseTotals[districtName]) {
//         districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0 };
//       }
//       districtWiseTotals[districtName].cash += receipt.cash || 0;
//       districtWiseTotals[districtName].private += receipt.private || 0;
//       districtWiseTotals[districtName].gov += receipt.gov || 0;
//     });

//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     const chunks = [];
//     doc.on("data", chunk => chunks.push(chunk));
//     doc.on("end", () => {
//       const pdfBuffer = Buffer.concat(chunks);
//       res.setHeader("Content-Type", "application/pdf");
//       res.setHeader("Content-Disposition", "attachment; filename=districtwise_receipts.pdf");
//       res.send(pdfBuffer);
//     });

//     doc.fontSize(16).font("Helvetica-Bold").text("District-wise Receipts Report", { align: "center" });
//     doc.moveDown();

//     const colX = { district: 50, cash: 250, private: 320, gov: 400 };

//     doc.fontSize(12).font("Helvetica-Bold");
//     doc.text("District", colX.district, doc.y);
//     doc.text("Cash", colX.cash, doc.y, { width: 60, align: "right" });
//     doc.text("Private", colX.private, doc.y, { width: 60, align: "right" });
//     doc.text("Gov", colX.gov, doc.y, { width: 60, align: "right" });
//     doc.moveDown(0.5);
//     doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
//     doc.moveDown(0.5);
//     doc.font("Helvetica");

//     Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//       doc.text(district, colX.district, doc.y);
//       doc.text(totals.cash.toFixed(2), colX.cash, doc.y, { width: 60, align: "right" });
//       doc.text(totals.private.toFixed(2), colX.private, doc.y, { width: 60, align: "right" });
//       doc.text(totals.gov.toFixed(2), colX.gov, doc.y, { width: 60, align: "right" });
//       doc.moveDown();

//       if (doc.y > doc.page.height - 50) {
//         doc.addPage();
//       }
//     });

//     doc.end();
//   } catch (error) {
//     console.error("Error generating district-wise receipts PDF:", error);
//     res.status(500).send("Error generating PDF");
//   }
// }

downloadDistrictwiseReceiptsPdf: async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;

    if (!userBranch || !startDate || !endDate) {
      return res.status(400).send("Required parameters missing");
    }

    const allDistricts = await District.find({ branch: userBranch }).lean();
    const districtMap = new Map(allDistricts.map(d => [d.name, d]));

    const receipts = await Receipt.find({
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

    const districtWiseTotals = {};
    let grandTotals = { cash: 0, private: 0, gov: 0, total: 0 };

    filteredReceipts.forEach(receipt => {
      const districtName = receipt.district;
      if (!districtWiseTotals[districtName]) {
        districtWiseTotals[districtName] = { cash: 0, private: 0, gov: 0, total: 0 };
      }

      const cash = receipt.cash || 0;
      const privateAmt = receipt.private || 0;
      const gov = receipt.gov || 0;
      const total = cash + privateAmt + gov;

      districtWiseTotals[districtName].cash += cash;
      districtWiseTotals[districtName].private += privateAmt;
      districtWiseTotals[districtName].gov += gov;
      districtWiseTotals[districtName].total += total;

      grandTotals.cash += cash;
      grandTotals.private += privateAmt;
      grandTotals.gov += gov;
      grandTotals.total += total;
    });

    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const chunks = [];
    doc.on("data", chunk => chunks.push(chunk));
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=districtwise_receipts.pdf");
      res.send(pdfBuffer);
    });

    // === Header Section ===
    doc.fontSize(16).font("Helvetica-Bold").text("District-wise Receipts Report", { align: "center" });
    doc.moveDown(1);
    doc.fontSize(12).font("Helvetica-Bold").text(`Branch: `, { continued: true }).font("Helvetica").text(userBranch);
    doc.font("Helvetica-Bold").text(`Start Date: `, { continued: true }).font("Helvetica").text(new Date(startDate).toLocaleDateString("en-IN"));
    doc.font("Helvetica-Bold").text(`End Date: `, { continued: true }).font("Helvetica").text(new Date(endDate).toLocaleDateString("en-IN"));
    doc.moveDown(1);

    // === Table Setup ===
    const colWidths = [150, 80, 80, 80, 80];
    const headers = ["District", "Cash", "Private", "Gov", "Total"];
    const startX = doc.x;
    let y = doc.y;
    const rowHeight = 20;

    const drawRow = (values, isHeader = false) => {
      let x = startX;
      values.forEach((val, idx) => {
        doc.rect(x, y, colWidths[idx], rowHeight).stroke();
        doc.font(isHeader ? "Helvetica-Bold" : "Helvetica")
           .fontSize(11)
           .text(val, x + 5, y + 5, { width: colWidths[idx] - 10, align: idx === 0 ? 'left' : 'right' });
        x += colWidths[idx];
      });
      y += rowHeight;

      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 40;
      }
    };

    drawRow(headers, true);

    Object.entries(districtWiseTotals).forEach(([district, totals]) => {
      drawRow([
        district,
        totals.cash.toFixed(2),
        totals.private.toFixed(2),
        totals.gov.toFixed(2),
        totals.total.toFixed(2)
      ]);
    });

    // === Grand Total Row ===
    drawRow([
      "Grand Total",
      grandTotals.cash.toFixed(2),
      grandTotals.private.toFixed(2),
      grandTotals.gov.toFixed(2),
      grandTotals.total.toFixed(2)
    ], true);

    doc.end();
  } catch (error) {
    console.error("Error generating district-wise receipts PDF:", error);
    res.status(500).send("Error generating PDF");
  }
}

,

// downloadDistrictwiseReceiptsExcel: async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const userBranch = req.user?.branch;

//     if (!userBranch || !startDate || !endDate) {
//       return res.status(400).send("Required parameters missing");
//     }

//     const allDistricts = await District.find({ branch: userBranch }).lean();
//     const districtMap = new Map(allDistricts.map(d => [d.name, d]));

//     const receipts = await Receipt.find({
//       date: { $gte: startDate, $lte: endDate }
//     }).lean();

//     const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

//     const districtWiseTotals = {};
//     filteredReceipts.forEach(receipt => {
//       const districtName = receipt.district;
//       if (!districtWiseTotals[districtName]) {
//         districtWiseTotals[districtName] = { cash: 0, online: 0, bank: 0 };
//       }
//       districtWiseTotals[districtName].cash += receipt.cash || 0;
//       districtWiseTotals[districtName].online += receipt.online || 0;
//       districtWiseTotals[districtName].bank += receipt.bank || 0;
//     });

//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("District-wise Receipts");

//     worksheet.columns = [
//       { header: "District", key: "district", width: 30 },
//       { header: "Cash", key: "cash", width: 15 },
//       { header: "Online", key: "online", width: 15 },
//       { header: "Bank", key: "bank", width: 15 },
//     ];

//     Object.entries(districtWiseTotals).forEach(([district, totals]) => {
//       worksheet.addRow({
//         district,
//         cash: totals.cash.toFixed(2),
//         online: totals.online.toFixed(2),
//         bank: totals.bank.toFixed(2),
//       });
//     });

//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader("Content-Disposition", "attachment; filename=districtwise_receipts.xlsx");

//     await workbook.xlsx.write(res);
//     res.end();
//   } catch (error) {
//     console.error("Error generating district-wise receipts Excel:", error);
//     res.status(500).send("Error generating Excel");
//   }
// }
downloadDistrictwiseReceiptsExcel: async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userBranch = req.user?.branch;

    if (!userBranch || !startDate || !endDate) {
      return res.status(400).send("Required parameters missing");
    }

    const allDistricts = await District.find({ branch: userBranch }).lean();
    const districtMap = new Map(allDistricts.map(d => [d.name, d]));

    const receipts = await Receipt.find({
      date: { $gte: startDate, $lte: endDate }
    }).lean();

    const filteredReceipts = receipts.filter(r => districtMap.has(r.district));

    const districtWiseTotals = {};
    const grandTotal = { cash: 0, private: 0, gov: 0, total: 0 };

    filteredReceipts.forEach(receipt => {
      const district = receipt.district;
      const cash = receipt.cash || 0;
      const privateAmt = receipt.private || 0;
      const gov = receipt.gov || 0;
      const total = cash + privateAmt + gov;

      if (!districtWiseTotals[district]) {
        districtWiseTotals[district] = { cash: 0, private: 0, gov: 0, total: 0 };
      }

      districtWiseTotals[district].cash += cash;
      districtWiseTotals[district].private += privateAmt;
      districtWiseTotals[district].gov += gov;
      districtWiseTotals[district].total += total;

      grandTotal.cash += cash;
      grandTotal.private += privateAmt;
      grandTotal.gov += gov;
      grandTotal.total += total;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("District-wise Receipts");

    // Header style
    const headerStyle = {
      alignment: { horizontal: "center" },
      font: { bold: true },
    };

    const formattedStartDate = new Date(startDate).toLocaleDateString("en-IN");
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-IN");

    // Add branch, start date, end date at top, centered and bold
    worksheet.mergeCells("A1:E1");
    worksheet.getCell("A1").value = `Branch: ${userBranch}`;
    worksheet.getCell("A1").style = headerStyle;

    worksheet.mergeCells("A2:E2");
    worksheet.getCell("A2").value = `Start Date: ${formattedStartDate}`;
    worksheet.getCell("A2").style = headerStyle;

    worksheet.mergeCells("A3:E3");
    worksheet.getCell("A3").value = `End Date: ${formattedEndDate}`;
    worksheet.getCell("A3").style = headerStyle;

    worksheet.addRow([]); // blank row after headers

    // Add table header manually and bold it
    const tableHeaderRow = worksheet.addRow(["District", "Cash", "Private", "Gov", "Total"]);
    tableHeaderRow.font = { bold: true };

    // Add data rows
    Object.entries(districtWiseTotals).forEach(([district, totals]) => {
      worksheet.addRow([
        district,
        totals.cash.toFixed(2),
        totals.private.toFixed(2),
        totals.gov.toFixed(2),
        totals.total.toFixed(2),
      ]);
    });

    // Grand total row, bold
    const grandRow = worksheet.addRow([
      "Grand Total",
      grandTotal.cash.toFixed(2),
      grandTotal.private.toFixed(2),
      grandTotal.gov.toFixed(2),
      grandTotal.total.toFixed(2),
    ]);
    grandRow.font = { bold: true };

    // Set column widths
    worksheet.columns = [
      { key: "district", width: 30 },
      { key: "cash", width: 15 },
      { key: "private", width: 15 },
      { key: "gov", width: 15 },
      { key: "total", width: 15 },
    ];

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=districtwise_receipts.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error generating district-wise receipts Excel:", error);
    res.status(500).send("Error generating Excel");
  }
}
};

module.exports = reportController;
