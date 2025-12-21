const regkey = (req, res, next) => {
  // Only check regkey for registration endpoint
  if (req.path !== '/register') {
    return next();
  }

  const providedKey = req.headers['x-registration-key'];
  
  if (!providedKey) {
    return res.status(400).json({ 
      error: 'Registration key required in x-registration-key header' 
    });
  }

  if (providedKey !== process.env.REGISTRATION_KEY) {
    return res.status(403).json({ 
      error: 'Invalid registration key' 
    });
  }

  next();
};

export default regkey;