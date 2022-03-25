import mongoose from 'mongoose';
import valid from 'validator'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => valid.isEmail(v),
      message: "Not a valid email"
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, { versionKey: false });

export default mongoose.model('user', userSchema);
