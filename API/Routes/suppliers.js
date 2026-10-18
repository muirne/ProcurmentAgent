const express = require('express');
const router = express.Router();
const data = require('../../DATA/master_data.json');


// GET /suppliers
router.get('/', (req, res) => {
  res.json(data.suppliers);
});

module.exports = router;
