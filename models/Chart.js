const mongoose = require('mongoose');

const ChartSchema = mongoose.Schema({
  TaskID: {
    type: String,
    required: true,
  },
  TaskName: {
    type: String,
    required: true,
  },
  Resource: {
    type: String,
  },
  StartDate: {
    type: Date,
  },
  EndDate: {
    type: Date,
    required: true,
  },
  Duration: {
    type: Number,
  },
  PercentComplete: {
    type: Number,
    required: true,
  },
  Dependencies: {
    type: String,
  },
});

module.exports = Chart = mongoose.model('chart', ChartSchema);
