const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../mongoose/models/user");

module.exports = {
  users: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Not authorized.');
    }
    try {
      const users = await User.find();
      return users.map((user) => ({ ...user._doc }));
    } catch (e) {
      console.log(e);
    }
  },
  createUser: async ({ userInput }) => {
    try {
      const existingUser = await User.findOne({ email: userInput.email });
      if (existingUser) {
        throw new Error("Account already exists for provided email address.");
      }
      const hashedPassword = await bcrypt.hash(userInput.password, 12);
      const user = new User({
        name: userInput.name,
        email: userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  login: async ({ email, password }) => {
    try {
      const fetchedUser = await User.findOne({ email: email });
      if (!fetchedUser) {
        throw new Error("Invalid credentials.");
      }
      const isValidPassword = await bcrypt.compare(
        password,
        fetchedUser.password
      );
      if (!isValidPassword) {
        throw new Error("Invalid credentials.");
      }
      const token = jwt.sign(
        { userID: fetchedUser.id },
        "TODO_CHANGE_THIS_TO_LONG_SECRET_KEY",
        { expiresIn: "1h" }
      );
      return { userID: fetchedUser.id, token: token, sessionExpiry: 1 };
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
