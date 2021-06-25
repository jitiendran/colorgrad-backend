const User = require("../schema/user");

module.exports = {
    Query: {
        async user_login(parent, args, context, info) {
            let user = null,
                wrongpassword = false;
            await User.findOne(
                { Username: args.data.Username },
                (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        user = result;
                        if (
                            user !== null &&
                            result.Password !== args.data.Password
                        ) {
                            wrongpassword = true;
                        }
                    }
                }
            );
            return user !== null
                ? wrongpassword
                    ? new Error("Incorrect Password")
                    : user
                : new Error("Invalid Username");
        },
    },
    Mutation: {
        async user_register(parent, args, context, info) {
            const user = new User({
                Username: args.data.Username,
                Email: args.data.Email,
                Password: args.data.Password,
                LinkedinProfile: null,
                GithubProfile: null,
                Colors: [],
                Gradients: [],
                Followers: [],
                Following: [],
                No_Of_Colors: 0,
                No_Of_Gradients: 0,
                Rating: 0,
            });

            await user.save((err, result) => {
                console.log(result._id);
            });
            return user;
        },

        async add_friend(parent, args, context, info) {
            let result;
            await User.findOneAndUpdate(
                { _id: args.data._id },
                { Following: [args.data.UserId] },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        User.findOneAndUpdate(
                            { _id: args.data.UserId },
                            { Followers: [args.data._id] },
                            (err, result) => {
                                if (err) console.log(err);
                                else {
                                    result = { Added: true };
                                }
                            }
                        );
                    }
                }
            );
            return result;
        },

        async add_favouriteColor(parent, args, context, info) {
            let added = false;

            await User.findByIdAndUpdate(
                { _id: args.data.UserId },
                {
                    Colors: [
                        {
                            ColorId: args.data.ColorId,
                            Colors: args.data.Colors,
                            Type: args.data.Type,
                            UsedBy: args.data.UsedBy,
                        },
                    ],
                },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        added = true;
                    }
                }
            );

            return added;
        },
    },
};
