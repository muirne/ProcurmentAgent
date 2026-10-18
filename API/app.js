const express = require('express');
const app = express();

app.use(express.json());

// testowy endpoint
app.get('/', (req, res) => {
  res.send('Toastwerk API działa ✔');
});

// suppliers
app.use('/suppliers', require('./Routes/suppliers'));

// fx
app.use('/fx', require('./Routes/fx'));

// cost centers
app.use('/cost_centers', require('./Routes/cost_centers'));

// approval limits
app.use('/approval_limits', require('./Routes/approval_limits'));

// rules
app.use('/rules', require('./Routes/rules'));

// gl accounts
app.use('/gl_accounts', require('./Routes/gl_accounts'));

// employees
app.use('/employees', require('./Routes/employees'));

// departments
app.use('/departments', require('./Routes/departments'));

// purchase orders
//

app.use('/PO', require('./Routes/PO'));

// uruchomienie serwera
app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});
