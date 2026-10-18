const express = require('express');
const router = express.Router();
const data =
    require('../../Data/master_data.json');

// GET /fx
router.get('/', (req, res) => {
  res.json(data._meta.fx_rates_to_chf);
});

module.exports = router;
