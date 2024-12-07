const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
}  

  const sendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
   
    res.cookie('token', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
      //sameSite: 'None'
    });
    user.password = undefined;
    res.status(statusCode).json({
      success: true,
      token,
      user 
    });

  };

module.exports =  sendToken;