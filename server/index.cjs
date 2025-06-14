const express = require('express');
const path = require('path');

const app = express();

// Servir le frontend
app.use(express.static(path.join(__dirname, '..', 'dist')));
// Express 5 requires a valid path pattern. Use a wildcard route.
// Serve the React app for any unmatched route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
