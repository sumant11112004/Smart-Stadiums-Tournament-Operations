const crypto = require('crypto');

// Generate CSRF token and set it as a cookie
const setCsrfCookie = (req, res) => {
  const csrfToken = crypto.randomBytes(24).toString('hex');
  // Set XSRF-TOKEN cookie (not HTTPOnly so client-side React can read it)
  res.cookie('XSRF-TOKEN', csrfToken, {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
  return csrfToken;
};

// Middleware to verify CSRF token
const verifyCsrfToken = (req, res, next) => {
  // Skip CSRF check for GET, HEAD, OPTIONS, and test environments
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method) || process.env.NODE_ENV === 'test') {
    return next();
  }

  const csrfCookie = req.cookies['XSRF-TOKEN'];
  const csrfHeader = req.headers['x-xsrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    res.status(403);
    return next(new Error('CSRF validation failed: Token mismatch or missing'));
  }

  next();
};

module.exports = { setCsrfCookie, verifyCsrfToken };
