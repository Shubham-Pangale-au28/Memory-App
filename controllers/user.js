const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModal = require("../models/user.js");

const secret = process.env.ACCESS_TOCKEN_SECRET || "test";

const signIn = async (req, res) => {
  logger.info("UserController ---> signIn ---> Reached");
  const { email, password } = req.body;
  try {
    const oldUser = await UserModal.findOne({ email });
    if (!oldUser) {
      logger.info("UserController ---> signIn ---> User not exist");
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
      logger.info("UserController ---> signIn ---> Invalid credential");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1d" });
    logger.info("UserController ---> signIn ---> End");
    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    logger.error("UserController ---> signIn ---> Error: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const signUp = async (req, res) => {
  logger.info("UserController ---> signUp ---> Reached");
  const { email, password, firstName, lastName } = req.body;
  try {
    const oldUser = await UserModal.findOne({ email });
    if (oldUser) {
      logger.info("UserController ---> signUn ---> User already exist");
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1d" });
    logger.info("UserController ---> signUn ---> End");
    res.status(201).json({ result, token });
  } catch (error) {
    logger.error("UserController ---> signUn ---> Error: ", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  signIn,
  signUp,
};
