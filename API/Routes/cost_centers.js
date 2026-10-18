
const express = require('express');
const router = express.Router();
const data = require('../../DATA/master_data.json');


// GET /cost centers
router.get('/', (req, res) => {
  res.json(data.cost_centers);
});

module.exports = router;
