const express = require('express');
const app = express();
app.get('/test', (req, res) => res.json({ ok: true }));
app.listen(5001, () => console.log('Test server on 5001'));
