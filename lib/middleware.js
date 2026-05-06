/**
 * lib/middleware.js
 * Reusable middleware functions — serverless-compatible.
 *
 * Pola penggunaan di handler:
 *   const { ok } = await applyMiddleware(req, res, [corsMiddleware, authMiddleware]);
 *   if (!ok) return; // middleware sudah kirim response
 */
const cors = require('cors');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tunakarya-cms-secret-2024';

// ─── CORS ────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    )
      return callback(null, true);
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
      return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
};

const corsMiddleware = cors(corsOptions);

/**
 * Wrap Express-style middleware menjadi Promise.
 * Berguna agar bisa di-await di serverless handler.
 */
const runMiddleware = (req, res, fn) =>
  new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      resolve(result);
    });
  });

/**
 * Jalankan array middleware secara berurutan.
 * Return { ok: false } jika salah satu middleware sudah mengirim response.
 */
const applyMiddleware = async (req, res, middlewares) => {
  for (const mw of middlewares) {
    if (res.writableEnded || res.headersSent) return { ok: false };
    try {
      await runMiddleware(req, res, mw);
    } catch (err) {
      res.status(500).json({ error: err.message });
      return { ok: false };
    }
  }
  return { ok: true };
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
/**
 * Express-style auth middleware — bisa dipakai di Express app ATAU di-await
 * via applyMiddleware().
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    if (typeof next === 'function') next();
  } catch (error) {
    const msg =
      error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    res.status(401).json({ error: msg });
  }
};

/**
 * Versi Promise dari authMiddleware — untuk dipakai di handler tanpa Express.
 * Return true jika auth berhasil, false jika sudah kirim error response.
 */
const requireAuth = async (req, res) => {
  const { ok } = await applyMiddleware(req, res, [authMiddleware]);
  return ok;
};

module.exports = {
  corsMiddleware,
  corsOptions,
  authMiddleware,
  requireAuth,
  applyMiddleware,
  runMiddleware,
  JWT_SECRET,
};
