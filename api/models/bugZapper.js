const mongoose = require('mongoose');

let CaptureSchema = new mongoose.Schema({
  lng: {type: Number, index: true},
  lat: {type: Number, index: true},
  cnt: {type: Number}
}, {
  timestamps: true
});

let BugZapperSchema = new mongoose.Schema({
  bugZapperId: {type: String, index: true},
  captures: [CaptureSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('BugZapper', BugZapperSchema);
