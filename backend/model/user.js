const mongoose = require("mongoose"); //.set('debug', true);
const bcrypt = require("bcrypt-nodejs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  dateOfBirth: String,
  mobileNum: String,
  gender: String,
  rating: Number,
  rides: [Schema.ObjectId],
  bio: String,
  imgURL: String,
  rideCompleted: Number,
  isVerified: Boolean,
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.statics.addRideReference = function (userId, rideId) {
  User.findOneAndUpdate({ _id: userId }, { $push: { rides: rideId } }).exec();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
