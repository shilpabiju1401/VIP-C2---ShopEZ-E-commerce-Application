const mongoose = require('mongoose');

const AdminSettingSchema = new mongoose.Schema({
  bannerImages: [{
    type: String
  }],
  announcements: [{
    type: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('AdminSetting', AdminSettingSchema);
