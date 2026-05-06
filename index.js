// Root entrypoint — required by Vercel's auto-detection
// Vercel searches for: index.js, app.js, server.js at root level
// This file simply re-exports the serverless handler from api/index.js
module.exports = require('./api/index');
