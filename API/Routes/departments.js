
const express = require('express');
const router = express.Router();
const data = require('../../DATA/master_data.json');


router.get('/', (req, res) => {
  res.json(data.departments);
});

module.exports = router;
