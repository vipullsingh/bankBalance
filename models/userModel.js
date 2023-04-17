const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['User', 'Moderator'],
      default: 'User',
    },
  },
  { timestamps: true }
);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  const user = this;
  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
