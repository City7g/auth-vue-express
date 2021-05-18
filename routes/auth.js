const router = require("express").Router();
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  // Validation
  const validation = registerValidation(req.body);
  if (validation.error) return res.send(validation.error.details[0].message);

  // Checking unique email
  const emailExist = await User.findOne({ name: req.body.name });
  if (emailExist) return res.send("Email already exists");

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post("/login", async (req, res) => {
  // Validation
  const validation = await loginValidation(req.body);
  if (validation.error) return res.send(validation.error.details[0].message);

  // Checking email and password
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send("Email is not found");
  if (user.password !== req.body.password) return res.send("Password invalid");

  // Send token
  let token = jwt.sign({ _id: user._id }, 'some-text');
  res.send(token);
});

module.exports = router;
