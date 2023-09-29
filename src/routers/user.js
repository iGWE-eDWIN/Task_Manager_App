const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeMessage } = require('../emails/account');

const router = new express.Router();

// setting up multer directory
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, callBack) {
    if (!file) return callBack(new Error('Please upload a file'));

    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return callBack(new Error('Please upload an inmage'));

    callBack(undefined, true);
  },
});

// Create user
router.post('/users', async (req, res) => {
  //   console.log(req.body);
  //   res.send('Testing');
  const user = new User(req.body);
  try {
    await user.save();

    const token = await user.generateAuthToken();
    res.status(201).send({
      user,
      token,
    });
  } catch (error) {
    //   console.log(error);
    res.status(400).send(error);
  }
});

// Login user
router.post('/users/login', async (req, res) => {
  const email = req.body.email;
  // console.log(email);
  const password = req.body.password;
  // console.log(password);
  try {
    const user = await User.findByCredentials(email, password);

    sendWelcomeMessage(user.name);
    // console.log(user);

    const token = await user.generateAuthToken();
    // console.log(token);

    res.status(200).send({
      user,
      token,
    });
  } catch (error) {
    res.status(400).send({ error });
  }
});

// Sign out user
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// sign out all
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// Read user profile
router.get('/users/me', auth, (req, res) => {
  res.send(req.user);
  //   (async () => {
  //     try {
  //       const users = await User.find({});
  //       res.send(users);
  //     } catch (err) {
  //       res.status(500).send({ error: err });
  //     }
  //   })();
});

// Read a specific user
router.get('/users/:id', (req, res) => {
  const _id = req.params.id;
  //   console.log(_id);

  (async () => {
    try {
      const users = await User.findById(_id);
      if (!users) return res.status(404).send();
      res.send(users);
    } catch (err) {
      res.status(500).send();
    }
  })();
});

// Update user
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const alloweUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) => {
    return alloweUpdates.includes(update);
  });

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates' });

  const id = req.user._id;
  try {
    // const users = await User.findByIdAndUpdate(id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const users = await User.findById(id);
    updates.forEach((update) => (users[update] = req.body[update]));
    await users.save();

    if (!users) return res.status(404).send();
    res.send(users);
  } catch (err) {
    res.status(400).send({ error: err });
  }
});

// Delete user
router.delete('/users/me', auth, async (req, res) => {
  //   const id = req.params.id;
  const id = req.user._id;
  try {
    const user = await User.findByIdAndRemove(id);
    // if (!user) return res.status(404).send();
    // res.send(user);
    // console.log(user);
    // console.log(req.users);
    console.log(user);

    // console.log(req.user);
    res.send(user);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

// File upload avatar
router.post(
  '/users/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    // Making use of sharp, saving and accessing the image data
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    // console.log(req.user.avatar);

    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Delete avatar
router.delete(
  '/users/me/avatar',
  auth,
  async (req, res) => {
    req.user.avatar = undefined;
    await req.user;

    res.status(200).send(req.user);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Get avatar
router.get('/users/:id/avatar', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);

    if (!user) throw new Error();

    res.set('Content-Type', 'image/png');
    res.status(200).send(user.avatar);
  } catch (error) {
    res.status(404).send({ error });
  }
});

module.exports = router;
