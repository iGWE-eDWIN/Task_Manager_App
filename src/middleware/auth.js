const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    // Get value for header
    const token = req.header('Authorization').replace('Bearer ', '');
    // console.log(token);

    // // Validate token
    const decoded = jwt.verify(token, process.env.JWT_Secret);
    // console.log(decoded);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    // console.log(user);

    if (!user) throw new Error();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please get authenticated' });
  }
};

module.exports = auth;
