const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Calculation = require('../models/Calculation');

const router = express.Router();

// Save calculation
router.post('/', authMiddleware, async (req, res) => {
  const { expression, result } = req.body;
  try {
    const newCalc = new Calculation({
      userId: req.user,
      expression,
      result
    });
    const calc = await newCalc.save();
    res.json(calc);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get history
router.get('/', authMiddleware, async (req, res) => {
  try {
    const calculations = await Calculation.find({ userId: req.user }).sort({ createdAt: -1 });
    res.json(calculations);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;