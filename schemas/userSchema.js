const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  lastname: String,
  contact_info: {
    address: {
      int_number: String,
      ext_number: String,
      neighborhood: String,
      zip_code: String,
      city: String,
      country: String,
      state: String,
      street: String,
    },
    phone_number: {
      area_code: Number,
      number: Number,
    },
  },

  role: {
    type: String,
    enum: ['editor', 'admin', 'user'],
    default: 'user',
  },

  search: Array,

  avatar_url: String,
  email: String,
  username: String,
  password: String,
  token: String,

  verified_email: {
    type: Boolean,
    default: false,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },

  // services
  openPayId: String,
});

userSchema.index({
  email: 1,
});

userSchema.index({
  username: 1,
});

userSchema.index({
  email: 1,
  username: 1,
});

module.exports = userSchema;

// Mappings
module.exports.userMappings = {
  createMap: {
    name: 'name',
    surname: 'surname',
    lastname: 'lastname',
    'address.int_number': 'contact_info.address.int_number',
    'address.ext_number': 'contact_info.address.ext_number',
    'address.neighborhood': 'contact_info.address.neighborhood',
    'address.zip_code': 'contact_info.address.zip_code',
    'address.city': 'contact_info.address.city',
    'address.street': 'contact_info.address.street',
    'address.state': 'contact_info.address.state',
    'address.country': 'contact_info.address.country',
    'phone_number.area_code': 'contact_info.phone_number.area_code',
    'phone_number.number': 'contact_info.phone_number.number',
    email: 'email',
    username: 'username',
    password: 'password',
    confirm_password: 'confirm_password',
    avatarFileType: 'fileType',
    avatar_url: 'avatar_url'
  },
  updateMap: {
    name: 'name',
    surname: 'surname',
    lastname: 'lastname',
    'address.int_number': 'contact_info.address.int_number',
    'address.ext_number': 'contact_info.address.ext_number',
    'address.neighborhood': 'contact_info.address.neighborhood',
    'address.zip_code': 'contact_info.address.zip_code',
    'address.city': 'contact_info.address.city',
    'address.state': 'contact_info.address.state',
    'address.country': 'contact_info.address.country',
    'address.street': 'contact_info.address.street',
    'phone_number.area_code': 'contact_info.phone_number.area_code',
    'phone_number.number': 'contact_info.phone_number.number',
    email: 'email',
  },
  infoMap: {
    name: 'name',
    surname: 'surname',
    lastname: 'lastname',
    'contact_info.address.int_number': 'address.int_number',
    'contact_info.address.ext_number': 'address.ext_number',
    'contact_info.address.neighborhood': 'address.neighborhood',
    'contact_info.address.zip_code': 'address.zip_code',
    'contact_info.address.city': 'address.city',
    'address.state': 'contact_info.address.state',
    'contact_info.address.country': 'address.country',
    'contact_info.address.street': 'address.street',
    'contact_info.phone_number.area_code': 'phone_number.area_code',
    'contact_info.phone_number.number': 'phone_number.number',

    email: 'email',
    username: 'username',
    avatar_url: 'avatar_url',
    id: 'id'
  },
  createRequiredFieldsList: 'name surname lastname contact_info.address.country contact_info.phone_number.number email username password confirm_password'.split(' '),
};
