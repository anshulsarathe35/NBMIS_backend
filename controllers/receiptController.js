// controllers/receiptController.js
const Receipt = require('../models/Receipt');

exports.getReceiptsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    const receipts = await Receipt.find({ date });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch receipts', error: err.message });
  }
};

// exports.createOrUpdateReceipt = async (req, res) => {
//   try {
//     const { district, date, cash, online, bank } = req.body;

//     let receipt = await Receipt.findOne({ district, date });

//     if (receipt) {
//       receipt.cash = cash;
//       receipt.online = online;
//       receipt.bank = bank;
//       await receipt.save();
//       res.json({ message: 'Receipt updated successfully' });
//     } else {
//       const newReceipt = new Receipt({ district, date, cash, online, bank });
//       await newReceipt.save();
//       res.status(201).json({ message: 'Receipt created successfully' });
//     }
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to create/update receipt', error: err.message });
//   }
// };


//newly added  -------------- correct one
// exports.createOrUpdateReceipt = async (req, res) => {
//     try {
//       const { district, date, cash, online, bank } = req.body;
  
//       if ((cash || 0) === 0 && (online || 0) === 0 && (bank || 0) === 0) {
//         return res.status(400).json({ message: 'Empty receipt not saved.' });
//       }
  
//       const updatedBy = req.user?._id;
  
//       let receipt = await Receipt.findOne({ district, date });
  
//       if (receipt) {
//         receipt.cash = cash;
//         receipt.online = online;
//         receipt.bank = bank;
//         receipt.updatedBy = updatedBy;
//         await receipt.save();
//         return res.json({ message: 'Receipt updated successfully', receipt });
//       }
  
//       const newReceipt = new Receipt({ district, date, cash, online, bank, updatedBy });
//       await newReceipt.save();
//       res.status(201).json({ message: 'Receipt created successfully', receipt: newReceipt });
//     } catch (err) {
//       res.status(500).json({ message: 'Failed to create/update receipt', error: err.message });
//     }
//   };

//new after branch creation

exports.createOrUpdateReceipt = async (req, res) => {
    try {
      const { branch, district, date, cash, private, gov } = req.body;
  
      if ((cash || 0) === 0 && (private || 0) === 0 && (gov || 0) === 0) {
        return res.status(400).json({ message: 'Empty receipt not saved.' });
      }
  
      const updatedBy = req.user?._id;
  
      let receipt = await Receipt.findOne({ district, date });
  
      if (receipt) {
        receipt.cash = cash;
        receipt.private = private;
        receipt.gov = gov;
        receipt.updatedBy = updatedBy;
        await receipt.save();
        return res.json({ message: 'Receipt updated successfully', receipt });
      }
  
      const newReceipt = new Receipt({ branch, district, date, cash, private, gov, updatedBy });
      await newReceipt.save();
      res.status(201).json({ message: 'Receipt created successfully', receipt: newReceipt });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create/update receipt', error: err.message });
    }
  };
  

exports.deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Receipt.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Receipt not found' });

    res.json({ message: 'Receipt deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete receipt', error: err.message });
  }
};
