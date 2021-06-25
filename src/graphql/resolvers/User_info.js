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
            let added = false;
            await User.findByIdAndUpdate(args.data._id, {
                Following: [
                    {
                        _id: args.data.UserId,
                        Username: args.data.Username,
                    },
                ],
            }).exec();

            await User.findByIdAndUpdate(
                args.data.UserId,
                {
                    Followers: [
                        {
                            _id: args.data._id,
                            Username: args.data.Myname,
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

        async remove_friend(parent, args, context, info) {
            let removed = false;

            await User.findByIdAndUpdate(args.data.UserId, {
                $pull: { Following: { _id: args.data.FriendId } },
            }).exec();

            try {
                await User.findByIdAndUpdate(args.data.FriendId, {
                    $pull: { Followers: { _id: args.data.UserId } },
                });
                removed = true;
            } catch {
                throw new Error("Cannot Remove the Friend");
            }
            return removed;
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

        async add_favouriteGradient(parent, args, context, info) {
            let updated = false;

            await User.findByIdAndUpdate(
                { _id: args.data.UserId },
                {
                    Gradients: [
                        {
                            GradientId: args.data.GradientId,
                            Colors: args.data.Colors,
                            Type: args.data.Type,
                            Direction: args.data.Direction,
                            UsedBy: args.data.UsedBy,
                        },
                    ],
                },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        updated = true;
                    }
                }
            );

            return updated;
        },

        async remove_favouriteColor(parent, args, context, info) {
            let removed = false;

            await User.findByIdAndUpdate(
                args.data.UserId,
                { $pull: { Colors: { ColorId: args.data.ColorId } } },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        removed = true;
                    }
                }
            );

            return removed;
        },

        async remove_favouriteGradient(parent, args, context, info) {
            let removed = false;

            await User.findByIdAndUpdate(
                args.data.UserId,
                { $pull: { Gradients: { GradientId: args.data.GradientId } } },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        removed = true;
                    }
                }
            );

            return removed;
        },
    },
};
