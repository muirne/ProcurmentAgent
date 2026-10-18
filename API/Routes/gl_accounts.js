const express = require('express');
const router = express.Router();
const data =
    require('../../Data/master_data.json');

router.get('/', (req, res) => {
  res.json(data.gl_accounts);
});

module.exports = router;