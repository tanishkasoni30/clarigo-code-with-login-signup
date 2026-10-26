const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    // title :{type:String ,required: true },
    // description :{type:String , required :true },
    // status :{type:String ,enum:['pending' , 'completed'], default : "pending "},
    role: { type: String, enum: ['Admin', 'User'], default: 'User' }
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;