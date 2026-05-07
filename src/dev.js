/**
 * src/dev.js — Local development server
 * Run: node src/dev.js
 */
require('dotenv').config();
const http = require('http');
const handler = require('../api/index');

const PORT = process.env.PORT || 3000;

const server = http.createServer(handler);
server.listen(PORT, () => {
  console.log(`\n🚀 Dev server running → http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
