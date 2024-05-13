const firebaseService = require('../services/firebaseService');

async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication token is required.' });
  }

  try {
    const { isValid, userId } = await firebaseService.verifyIdToken(token);
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = userId;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: 'Invalid token: ' + error.message });
  }
}

module.exports = authenticate;
