const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },

  chartInfo: [
    {
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
    },
  ],

  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Chart = mongoose.model('chart', ChartSchema);
