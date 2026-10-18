
const express = require('express');
const router = express.Router();

    const data =    require('../../DATA/master_data.json');


router.get('/', (req, res) => {
  res.json(data.approval_limits_chf);
});

module.exports = router;

const path = require('path');

console.log(
  path.resolve(
    __dirname,
    '../../DATA/master_data.json'
  )
);