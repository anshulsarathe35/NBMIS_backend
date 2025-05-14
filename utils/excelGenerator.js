// utils/excelGenerator.js
const ExcelJS = require('exceljs');

// Generate Excel for Sales Report
exports.generateSalesExcel = async (sales) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sales Report');

  worksheet.columns = [
    { header: 'District', key: 'district', width: 20 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Cash', key: 'cash', width: 15 },
    { header: 'Private', key: 'private', width: 15 },
    { header: 'Gov', key: 'gov', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  sales.forEach(sale => {
    worksheet.addRow({
      district: sale.district,
      date: sale.date,
      cash: sale.cash,
      private: sale.private,
      gov: sale.gov,
      total: sale.cash + sale.private + sale.gov,
    });
  });

  return workbook.xlsx.writeBuffer();
};

// Generate Excel for Receipts Report
exports.generateReceiptsExcel = async (receipts) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Receipts Report');

  worksheet.columns = [
    { header: 'District', key: 'district', width: 20 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Cash', key: 'cash', width: 15 },
    { header: 'Private', key: 'private', width: 15 },
    { header: 'Gov', key: 'gov', width: 15 },
    { header: 'Total', key: 'total', width: 15 },
  ];

  receipts.forEach(receipt => {
    worksheet.addRow({
      district: receipt.district,
      date: receipt.date,
      cash: receipt.cash,
      private: receipt.private,
      gov: receipt.gov,
      total: receipt.cash + receipt.private + receipt.gov,
    });
  });

  return workbook.xlsx.writeBuffer();
};
