const User = require("../schema/user");

module.exports = {
  Query: {
    async user_login(parent, args, context, info) {
      let user = null,
        wrongpassword = false;
      await User.findOne({ Username: args.data.Username }, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          user = result;
          if (user !== null && result.Password !== args.data.Password)
            wrongpassword = true;
        }
      });
      return user !== null
        ? wrongpassword
          ? new Error("Incorrect Password")
          : user
        : new Error("Invalid Username");
    },
    async user_register(parent, args, context, info) {
      const user = new User({
        Username: args.data.Username,
        Email: args.data.Email,
        Password: args.data.Password,
        LinkedinProfile: null,
        GithubProfile: null,
        Friends: [],
        Colors: [],
        Gradients: [],
        Rating: 0,
      });

      await user.save((err, result) => {
        console.log(result._id);
      });
      return user;
    },
  },
};
