const mongoose = require('mongoose')
const mongooseHidden = require('mongoose-hidden')
const bcrypt = require('bcrypt')
const mongooseUniqueValidator = require('mongoose-unique-validator')
const masterKey = 'Wild2020'

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return /^.+@[^.].*\.[a-z]{2,}$/.test(email)
      },
      message: 'Email must be valid.'
    }
  },
  password: { type: String, required: true, match: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/ },
  showWishList: { type: Boolean },
  campgroundWishList: [{ type: mongoose.Schema.ObjectId, ref: 'Campground' }],
  showVisited: { type: Boolean },
  campgroundsVisited: [{ type: mongoose.Schema.ObjectId, ref: 'Campground' }],
  avatarPhoto: { type: String },
  isAdmin: { type: Boolean },
  isVIP: { type: Boolean },
  bio: { type: String },
  recAreaReviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
  campgroundReviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }]
}, {
  timestamps: true
})

userSchema.plugin(mongooseHidden({ defautHidden: { password: true } }))
userSchema.plugin(mongooseUniqueValidator)

userSchema
  .virtual('passwordConfirmation')
  .set(function setPasswordConfirmation(passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

userSchema
  .virtual('adminKey')
  .set(function setAdminKey(adminKey) {
    this._adminKey = adminKey
  })

userSchema
  .pre('validate', function checkPassword(next) {
    if (this._passwordConfirmation !== this.password) {
      this.invalidate('passwordConfirmation', 'should match')
    }
    next()
  })

userSchema
  .pre('validate', function checkAdminKey(next) {
    if (this._adminKey !== masterKey) {
      this.admin = false
    } else {
      this.admin = true
    }
    next()
  })

userSchema
  .pre('save', function hashPassword(next) {
    console.log(this._passwordConfirmation)
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema) 