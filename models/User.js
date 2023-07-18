const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "PLEASE PROVIDE A USERNAME"],
    // trim: true,
    minLength: [3, "minimum characters is 3"],
    maxLength: [50, "max character is 50"],
  },

  email: {
    type: String,
    required: [true, "PLEASE PROVIDE AN EMAIL"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "please provide valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "PLEASE PROVIDE A PASSWORD"],
    // trim: true,
    minLength: [3, "minimum characters is 3"],
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userID: this._id, name: this.name },
    process.env.JWT_SECRET,
    {expiresIn:process.env.JWT_EXP}
  );
};
userSchema.methods.checkPassword = async function (canditatePassword) {
 const match= bcrypt.compare(canditatePassword,this.password)
 return match
}

module.exports = mongoose.model("User", userSchema);
