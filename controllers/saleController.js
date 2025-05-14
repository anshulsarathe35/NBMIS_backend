// controllers/saleController.js
const Sale = require('../models/Sale');

exports.getSalesByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const sales = await Sale.find({ date });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch sales', error: err.message });
  }
};

// exports.createOrUpdateSale = async (req, res) => {
//   try {
//     const { district, date, amount } = req.body;

//     let sale = await Sale.findOne({ district, date });

//     if (sale) {
//       sale.amount = amount;
//       await sale.save();
//       res.json({ message: 'Sale updated successfully' });
//     } else {
//       const newSale = new Sale({ district, date, amount });
//       await newSale.save();
//       res.status(201).json({ message: 'Sale created successfully' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create/update sale', error: err.message });
//   }
// };

//new 
// exports.createOrUpdateSale = async (req, res) => {
//     try {
//       const { branch, district, date, amount } = req.body;
//       const userId = req.user?.id;
  
//       let sale = await Sale.findOne({ district, date });
  
//       if (sale) {
//         sale.amount = amount;
//         sale.updatedBy = userId;
//         await sale.save();
//         res.json({ message: 'Sale updated successfully' });
//       } else {
//         const newSale = new Sale({ branch, district, date, amount, updatedBy: userId });
//         await newSale.save();
//         res.status(201).json({ message: 'Sale created successfully' });
//       }
//     } catch (err) {
//       res.status(500).json({ message: 'Failed to create/update sale', error: err.message });
//     }
//   };

exports.createOrUpdateSale = async (req, res) => {
    try {
      const { branch, district, date, cash, private: privateAmount, gov } = req.body;
  
      // If all fields are 0 or missing, do not save
      if ((cash || 0) === 0 && (privateAmount || 0) === 0 && (gov || 0) === 0) {
        return res.status(400).json({ message: 'Empty sale not saved.' });
      }
  
      const updatedBy = req.user?._id;
  
      let sale = await Sale.findOne({ district, date });
  
      if (sale) {
        sale.cash = cash;
        sale.private = privateAmount;
        sale.gov = gov;
        sale.updatedBy = updatedBy;
        await sale.save();
        return res.json({ message: 'Sale updated successfully', sale });
      }
  
      const newSale = new Sale({ branch, district, date, cash, private: privateAmount, gov, updatedBy });
      await newSale.save();
      res.status(201).json({ message: 'Sale created successfully', sale: newSale });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create/update sale', error: err.message });
    }
  };
  
  

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Sale.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Sale not found' });

    res.json({ message: 'Sale deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete sale', error: err.message });
  }
};
