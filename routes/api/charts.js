const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Chart = require('../../models/Chart');

// @route   GET api/charts
// @desc    Get all charts(projects)
// @acces   Public
router.get('/', async (req, res) => {
  try {
    const charts = await Chart.find().populate('user', ['name']);
    res.json(charts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   Post api/charts
// @desc    Create chart(project)
// @acces   Private
router.post(
  '/',
  [auth, [body('name', 'Please enter project name').notEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id).select('-password');

    try {
      // See if the project already exists
      let charts = await Chart.find({ user: req.user.id });
      let chart = charts.filter((chart) => chart.name === req.body.name);
      if (chart.length) {
        return res.status(400).json({ msg: 'This project already exists' });
      }

      // Create
      const chartFields = {};
      chartFields.user = req.user.id;
      chartFields.userName = user.name;
      chartFields.name = req.body.name;
      chart = new Chart(chartFields);
      await chart.save();

      res.json(chart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/charts/user/:user_id
// @desc    Read chart(project) by user id
// @acces   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const chart = await Chart.find({ user: req.params.user_id }).populate('user', ['name']);
    if (!chart) return res.status(400).json({ msg: 'User not found' });
    res.json(chart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/charts/:id
// @desc    Update chart(project) by id
// @acces   Private


// @route   DELETE api/charts/:id
// @desc    Delete chart(project) by id
// @acces   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id);
    // See if project exists
    if (!chart) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    // Check user
    if (chart.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await chart.remove();
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ----- about chart infomation -----

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

// @route   PUT api/charts/info/:info_id
// @desc    Update chart info
// @acces   Private
router.put(
  '/info/:info_id',
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

    const updateInfo = {
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
        (info) => info.TaskID === updateInfo.TaskID && info.id !== req.params.id
      );
      if (sameNameInfo.length) {
        return res.status(400).json({ msg: 'TaskID is duplicated' });
      }

      // Get update index
      const updateIndex = chart.info
        .map((item) => item.id)
        .indexOf(req.params.info_id);
      chart.info.splice(updateIndex, 1, updateInfo);

      await chart.save();
      res.json(chart);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
