// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// allow cross-origin requests
app.use(cors());

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = () => {
    res.write(`data: ${JSON.stringify({ message: 'Hello, SSE!' })}\n\n`);
  };

  const interval = setInterval(sendEvent, 1000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello, World!', date: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
