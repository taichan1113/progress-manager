const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Chart = require('../../models/Chart');

// @route   GET api/charts
// @desc    Get all charts
// @acces   Public
router.get('/', async (req, res) => {
  try {
    const charts = await Chart.find();
    res.json(charts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Post api/charts
// @desc    Create chart
// @acces   Private
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const newChart = new Chart({
      user: req.user.id,
      name: user.name,
    });
    const chart = await newChart.save();
    res.json(chart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/charts/info
// @desc    Add chart info
// @acces   Private
router.put(
  '/info',
  [
    auth,
    [
      body('TaskID', 'Task ID is required').notEmpty(),
      body('TaskName', 'Task name is required').notEmpty(),
      body('StartDate', 'Start date or Duration is required')
        .if(body('Duration').not().exists())
        .isDate(),
      body('EndDate', 'End date is required').isDate(),
      body('Duration', 'Start date or Duration is required')
        .if(body('StartDate').not().exists())
        .isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      TaskID,
      TaskName,
      Resource,
      StartDate,
      EndDate,
      Duration,
      PercentComplete,
      Dependencies,
    } = req.body;

    const newInfo = {
      TaskID,
      TaskName,
      Resource,
      StartDate,
      EndDate,
      Duration,
      PercentComplete,
      Dependencies,
    };

    try {
      const chart = await Chart.findOne({ user: req.user.id });
      // See if TaskID is duplicated
      const sameNameInfo = chart.info.filter(
        (info) => info.TaskID === newInfo.TaskID
      );
      if (sameNameInfo.length) {
        return res.status(400).json({ msg: 'TaskID is duplicated' });
      }

      chart.info.unshift(newInfo);
      await chart.save();
      res.json(chart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/charts/info/:id
// @desc    Delete chart info
// @acces   Private
router.delete('/info/:info_id', auth, async (req, res) => {
  try {
    const chart = await Chart.findOne({ user: req.user.id });
    // Get remove index
    const removeIndex = chart.info
      .map((item) => item.id)
      .indexOf(req.params.info_id);
    chart.info.splice(removeIndex, 1);
    await chart.save();
    res.json(chart);
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
