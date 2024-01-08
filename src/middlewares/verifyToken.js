const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const { authorization } = req.body;

  if (!authorization)
    return res.status(401).send({ message: 'No token provided' });

  const authParts = authorization.split(' ');

  if (authParts.length !== 2)
    return res.status(401).send({ message: 'Token error' });

  const [scheme, token] = authParts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).send({ message: 'Token is poorly formatted' });

  jwt.verify(token, process.env.API_SECRET, (err, decoded) => {
    if (err) res.status(401).send({ message: 'Invalid token' });

    req.userId = decoded.id

    return next();
  });
};
