const router = require("express").Router();
const User = require("../model/User");
// const jwt = require("jsonwebtoken");
// const { registerValidation, loginValidation } = require("../validation");

router.get("/", async (req, res) => {
  try {
    const user = await User.find();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { name: req.body.name, email: req.body.email }
    );
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  // console.log(req.params.id);
  // res.send(req.params.id)

  try {
    const user = await User.deleteOne({ _id: req.params.id });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

// router.post("/login", async (req, res) => {
//   // Validation
//   const validation = await loginValidation(req.body);
//   if (validation.error)
//     return res.status(400).send(validation.error.details[0].message);

//   // Checking email and password
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) return res.status(400).send("Email is not found");
//   if (user.password !== req.body.password)
//     return res.status(400).send("Password invalid");

//   // Send token
//   let token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
//   res.send({ token, user });
// });

module.exports = router;
