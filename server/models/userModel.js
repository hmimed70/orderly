const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have more than 4 characters"],
  },
  username: {
    type: String,
    required: [true, "Please Enter Your Username"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [3, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, 'please enter your Email'],
    unique: true,
    validate: [validator.isEmail, "Please Enter a valid Email"]
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: {
    type: String,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  state: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'confirmatrice'],
    default: 'confirmatrice',
  },
  
  confirmedOrders: { type: Number, default: 0 },
  orderConfirmedPrice: { type: Number, default: 20 },
  earnings: { type: Number, default: 0 }, // Earnings for confirmed orders
  handleLimit: { type: Number, default: 10 }, // Set by admin
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
},
{
    timestamps: true,
  });

// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});
// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword, ) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};


userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(24).toString("hex");
  
    // Hashing and adding resetPasswordToken to userSchema
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User ;