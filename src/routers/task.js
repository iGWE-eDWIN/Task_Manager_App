const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

// create task
router.post('/task', auth, async (req, res) => {
  //   res.send('Testing');
  //   console.log(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Read task // tasks?completed = true
router.get('/tasks', auth, async (req, res) => {
  const booleanValue = req.query.completed;
  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);
  // console.log(booleanValue);
  const match = {};
  const sort = {};
  const sorted = req.query.sortBy;
  console.log(sorted);

  if (booleanValue) match.completed = booleanValue === 'true';

  if (sorted) {
    const parts = sorted.split('_');
    // console.log(parts);
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    // console.log(sort);
  }

  try {
    // const tasks = await Task.find({ owner: req.user._id });
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit,
        skip,
        sort,
      },
    });
    res.send(req.user.tasks);
    // res.send(tasks);
    //   console.log(tasks);
  } catch (err) {
    res.status(500).send();
  }
});

// Read a specific task
router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id;
  //   console.log(_id);
  try {
    const tasks = await Task.findOne({
      _id,
      owner: req.user._id,
    });
    if (!tasks) return res.status(404).send();
    res.send(tasks);
  } catch (err) {
    res.status(500).send();
  }
});

// Update task
router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const alloweUpdates = ['description', 'completed'];
  const isValidOperation = updates.every((update) => {
    return alloweUpdates.includes(update);
  });

  if (!isValidOperation)
    return res.status(404).send({ error: 'Invalid updates' });

  const id = req.params.id;

  try {
    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    // const task = await Task.findById(id);
    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) return res.status(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// Delete task
router.delete('/tasks/:id', auth, async (req, res) => {
  const id = req.params.id;
  try {
    // const task = await Task.findByIdAndRemove(id);
    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!task) return res.status(404).send();
    res.send(task);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

module.exports = router;
