const mongoose = require('mongoose')

const recAreaSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  phone: { type: String },
  email: { type: String },
  address1: { type: String },
  address2: { type: String },
  website: { type: String },
  city: { type: String },
  state: { type: String },
  longitude: { type: Number },
  latitude: { type: Number },
  keywords: [ { type: String } ],
  lastUpdated: { type: String },
  ridbRecAreaId: { type: String },
  reviews: [{ type: mongoose.Schema.ObjectId, ref: 'Review' }],
  media: [{
    url: { type: String },
    title: { type: String }
  }],
  campgrounds: [{ type: mongoose.Schema.ObjectId, ref: 'Campground' }]
})

module.exports = mongoose.model('RecArea', recAreaSchema)


