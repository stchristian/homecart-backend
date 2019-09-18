const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(' ')[1]; //Authorization: Bearer <tokenstring...>
  if (!token || token === '') {
    req.isAuth = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    req.isAuth = false;
    return next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }
  
  // Object.defineProperties(req, 'user', 
  // get() {
  //   if(this.user) {
  //     User.find({ _id: decodedToken.userId })
  //   }
  // })
  req.isAuth = true;
  req.userId = decodedToken.userId;
  req.user = await User.find({ _id: decodedToken.userId})
  next();
};
