const app = require('../index.js');

module.exports = (req, res) => {
  try {
    const p = req.query && (req.query.path || req.query.p || req.query._path);
    if (p) {
      req.url = '/' + String(p).replace(/^\/+/, '');
    }
    return app(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
};
