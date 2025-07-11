const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY;

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'email_and_password_required' });
    }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'user_not_found' });
    }
    console.log('Password envoyé:', password);
    console.log('Hash en base:', user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'wrong_credentials' });
    }

    const payloadUser = {
      id: user._id,
      email: user.email,
      username: user.username
    };

    const token = jwt.sign(payloadUser, SECRET_KEY, { expiresIn: '24h' });

    return res.status(200).json({
      message: 'authenticate_succeeded',
      token: 'Bearer ' + token,
      user: payloadUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  return res.status(200).json({ message: 'logout_success' });
};