const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const getUser = require("../auth/getuser");
const generatetoken = require("../auth/generatetoken");
const randtoken = require("rand-token");
const bcrypt = require("bcryptjs");

require("dotenv").config();

module.exports = {
    Query: {
        async user_login(parent, { data }, context, info) {
            let token = "",
                refreshToken = "";

            const user = await User.findOne({
                Username: data.Username,
            }).exec();

            if (user) {
                const isMatching = await bcrypt.compare(
                    data.Password,
                    user.Password
                );

                if (isMatching) {
                    token = generatetoken(
                        { _id: user?._id, Username: user?.Username },
                        process.env.ACCESS_TOKEN
                    );
                    refreshToken = randtoken.uid(64);
                } else {
                    throw new Error("Incorrect Password");
                }
            } else {
                throw new Error("Invalid Username");
            }
            return { Token: token, RefreshToken: refreshToken };
        },
    },
    Mutation: {
        async user_register(parent, { data }, context, info) {
            const hashedPassword = await bcrypt.hash(String(data.Password), 10);

            const user = new User({
                Username: data.Username,
                Email: data.Email,
                Password: hashedPassword,
                LinkedinProfile: null,
                GithubProfile: null,
                Colors: [],
                Gradients: [],
                Followers: [],
                Following: [],
                No_Of_Colors: 0,
                No_Of_Gradients: 0,
                Rating: 0,
                Token: null,
            });

            await user.save((err, result) => {
                console.log(result);
            });
            return user;
        },

        async refresh_token(parent, { data }, { req }, info) {
            let output = { Token: null, RefreshToken: null };

            await User.findByIdAndUpdate(
                data.UserId,
                { Token: data.RefreshToken },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        output.Token = generatetoken(
                            {
                                _id: data.UserId,
                                Username: data.Username,
                            },
                            data.RefreshToken
                        );
                        output.RefreshToken = randtoken.uid(64);
                    }
                }
            );
            return output;
        },

        async add_friend(parent, { data }, { req }, info) {
            let added = false;
            const user = getUser(req);

            await User.findByIdAndUpdate(user._id, {
                Following: [
                    {
                        _id: data.UserId,
                        Username: data.Username,
                    },
                ],
            }).exec();

            await User.findByIdAndUpdate(
                data.UserId,
                {
                    Followers: [
                        {
                            _id: user._id,
                            Username: user.Username,
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

        async remove_friend(parent, { data }, { req }, info) {
            let removed = false;

            const user = getUser(req);

            await User.findByIdAndUpdate(user._id, {
                $pull: { Following: { _id: data.FriendId } },
            }).exec();

            try {
                await User.findByIdAndUpdate(data.FriendId, {
                    $pull: { Followers: { _id: user._id } },
                });
                removed = true;
            } catch {
                throw new Error("Cannot Remove the Friend");
            }
            return removed;
        },

        async add_favouriteColor(parent, { data }, context, info) {
            let added = false;

            await User.findByIdAndUpdate(
                { _id: data.UserId },
                {
                    Colors: [
                        {
                            ColorId: data.ColorId,
                            Colors: data.Colors,
                            Type: data.Type,
                            UsedBy: data.UsedBy,
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

        async add_favouriteGradient(parent, { data }, context, info) {
            let updated = false;

            await User.findByIdAndUpdate(
                { _id: data.UserId },
                {
                    Gradients: [
                        {
                            GradientId: data.GradientId,
                            Colors: data.Colors,
                            Type: data.Type,
                            Direction: data.Direction,
                            UsedBy: data.UsedBy,
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

        async remove_favouriteColor(parent, { data }, context, info) {
            let removed = false;

            await User.findByIdAndUpdate(
                data.UserId,
                { $pull: { Colors: { ColorId: data.ColorId } } },
                (err, result) => {
                    if (err) console.log(err);
                    else {
                        removed = true;
                    }
                }
            );

            return removed;
        },

        async remove_favouriteGradient(parent, { data }, context, info) {
            let removed = false;

            await User.findByIdAndUpdate(
                data.UserId,
                { $pull: { Gradients: { GradientId: data.GradientId } } },
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
