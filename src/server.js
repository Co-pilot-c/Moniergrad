/**
 * src/server.js — Development local server
 *
 * File ini HANYA untuk menjalankan server lokal (npm run dev / npm start).
 * Di Vercel, entry point adalah api/index.js (tidak ada app.listen di sana).
 *
 * Dengan cara ini:
 *  - Local dev: node src/server.js  → listen di PORT
 *  - Vercel:    api/index.js        → export app sebagai handler
 */
require('dotenv').config();

const app = require('../api/index');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`[DEV] CMS Server running → http://localhost:${PORT}`);
  console.log(`[DEV] Health check     → http://localhost:${PORT}/api/health`);
});
