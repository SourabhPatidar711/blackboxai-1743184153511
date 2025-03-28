const mongoose = require('mongoose');
const { Schema } = mongoose;

const DisasterSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['fire', 'flood', 'earthquake', 'cyclone', 'landslide', 'other'],
    index: true
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 &&
                 coords[1] >= -90 && coords[1] <= 90;
        },
        message: 'Invalid coordinates format [longitude, latitude]'
      }
    }
  },
  severity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['reported', 'verified', 'in_progress', 'resolved'],
    default: 'reported'
  },
  resourcesRequired: {
    medicalTeams: { type: Number, min: 0, default: 0 },
    foodSupplies: { type: Number, min: 0, default: 0 },
    rescueTeams: { type: Number, min: 0, default: 0 }
  },
  images: [{
    url: String,
    timestamp: { type: Date, default: Date.now }
  }],
  verified: {
    isVerified: Boolean,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      return ret;
    }
  }
});

// Geospatial index for location-based queries
DisasterSchema.index({ location: '2dsphere' });

// Index for frequently queried fields
DisasterSchema.index({ type: 1, severity: -1, status: 1 });

// Virtual for formatted location
DisasterSchema.virtual('locationFormatted').get(function() {
  return `Lat: ${this.location.coordinates[1]}, Lng: ${this.location.coordinates[0]}`;
});

// Pre-save hook for data validation
DisasterSchema.pre('save', function(next) {
  if (this.resourcesRequired.medicalTeams < 0) this.resourcesRequired.medicalTeams = 0;
  if (this.resourcesRequired.foodSupplies < 0) this.resourcesRequired.foodSupplies = 0;
  if (this.resourcesRequired.rescueTeams < 0) this.resourcesRequired.rescueTeams = 0;
  next();
});

module.exports = mongoose.model('Disaster', DisasterSchema);