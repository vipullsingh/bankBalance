const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');

const jwtConfig = require('../config/jwt');

// Login user and issue JWT access and refresh tokens
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches hashed password in database
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Issue JWT access and refresh tokens
    const accessToken = jwt.sign({ userId: user._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.accessExpiresIn,
    });
    const refreshToken = jwt.sign({ userId: user._id }, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshExpiresIn,
    });

    // Save refresh token to database
    await RefreshToken.create({ token: refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh access token using refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Check if refresh token is blacklisted
    const blacklistedToken = await RefreshToken.findOne({ token: refreshToken });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Verify refresh token and issue new access token
    const decoded = jwt.verify(refreshToken, jwtConfig.secret);
    const accessToken = jwt.sign({ userId: decoded.userId }, jwtConfig.secret, {
      expiresIn: jwtConfig.accessExpiresIn,
    });

    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

// Logout user by blacklisting refresh token
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Save refresh token to blacklist in database
    await RefreshToken.create({ token: refreshToken });

    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
