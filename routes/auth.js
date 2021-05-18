const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // Validation
  const validation = registerValidation(req.body);
  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);

  // Checking unique email
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    // Create user in Mongo
    const savedUser = await user.save();

    // Send token
    let token = jwt.sign({ _id: savedUser._id }, process.env.SECRET_TOKEN);
    res.send({ token, savedUser });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // Validation
  const validation = await loginValidation(req.body);
  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);

  // Checking email and password
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");
  if (user.password !== req.body.password)
    return res.status(400).send("Password invalid");

  // Send token
  let token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  res.send({ token, user });
});

router.post("/reset", async (req, res) => {
  // Validation
  const validation = await loginValidation(req.body);
  if (validation.error)
    return res.status(400).send(validation.error.details[0].message);

  // Checking email and password
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Email is not found");
  if (user.password === req.body.password)
    return res.status(400).send("Password is old");

  // Change password
  try {
    const some = await User.updateOne(
      { user: req.params.user },
      { password: req.body.password }
    );

    let token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
    user.password = req.body.password;
    res.send({ token, user, some });
  } catch (err) {
    res.status(400).send(err);
  }

  // Send token
  let token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
  res.send({ token, user });
});

module.exports = router;
