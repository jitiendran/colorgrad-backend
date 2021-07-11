const User = require("../schema/user");
const Color = require("../schema/color");
const Gradient = require("../schema/gradient");
const getUser = require("../auth/getuser");
const generatetoken = require("../auth/generatetoken");
const randtoken = require("rand-token");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const getuser = require("../auth/getuser");

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
                        {
                            _id: user._id,
                            Username: user.Username,
                            Profile: user.Profile,
                            Expire: Date.now() + 600,
                        },
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

        async get_user(parent, { data }, context, info) {
            let user = null;

            try {
                user = await User.findOne({ _id: data.UserId }).exec();
            } catch {
                throw new Error("Cannot get User");
            }

            return user;
        },

        async get_color(parent, { data }, context, info) {
            let color = null;

            try {
                color = await Color.find({ UserId: data.UserId }).exec();
            } catch {
                throw new Error("Cannot get Colors");
            }

            return color;
        },

        async get_gradient(parent, { data }, context, info) {
            let gradient = null;

            try {
                gradient = await Gradient.find({ UserId: data.UserId }).exec();
            } catch {
                throw new Error("Cannot get Gradients");
            }

            return gradient;
        },

        async get_allusers(parent, { data }, { req }, info) {
            let allUsers = [];
            try {
                allUsers = await User.find({}).lean();
            } catch {
                throw new Error("Cannot get all users");
            }

            return allUsers;
        },
        async check_username(parent, { data }, context, info) {
            const { Username } = data;
            let found = false;

            const user = await User.findOne({ Username }).exec();

            return user ? true : false;
        },
    },
    Mutation: {
        async user_register(parent, { data }, context, info) {
            const hashedPassword = await bcrypt.hash(String(data.Password), 10);
            let token = null,
                refreshToken = null;

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
                Profile: null,
            });

            const createdUser = await user.save();

            token = generatetoken(
                {
                    _id: createdUser._id,
                    Username: createdUser.Username,
                    Profile: createdUser.Profile,
                    Expire: Date.now() + 600,
                },
                process.env.ACCESS_TOKEN
            );
            refreshToken = randtoken.uid(64);

            return { Token: token, RefreshToken: refreshToken };
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
                                Expire: Date.now() + 1800,
                            },
                            process.env.ACCESS_TOKEN
                        );
                        output.RefreshToken = randtoken.uid(64);
                    }
                }
            );

            return output;
        },

        async update_user(parent, { data }, { req }, info) {
            let updated = false;

            const user = getUser(req);

            try {
                await User.findByIdAndUpdate(user._id, {
                    LinkedinProfile: data.LinkedinProfile,
                    GithubProfile: data.GithubProfile,
                }).exec();
                updated = true;
            } catch {
                throw new Error("Cannot Update User");
            }
            return updated;
        },

        async add_friend(parent, { data }, { req }, info) {
            let added = false;

            const userId = getUser(req)._id;

            const user = await User.findOne({ _id: userId });

            const friend = await User.findOne({ _id: data.UserId }).exec();

            await User.findByIdAndUpdate(user._id, {
                $push: {
                    Following: [
                        {
                            _id: data.UserId,
                            Username: friend.Username,
                            Email: friend.Email,
                            Profile: friend.Profile || null,
                        },
                    ],
                },
            }).exec();

            try {
                await User.findByIdAndUpdate(data.UserId, {
                    $push: {
                        Followers: [
                            {
                                _id: user._id,
                                Username: user.Username,
                                Email: user.Email,
                                Profile: user.Profile || null,
                            },
                        ],
                    },
                }).exec();

                added = true;
            } catch {
                throw new Error("Cannot add friend");
            }

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
                }).exec();

                removed = true;
            } catch {
                throw new Error("Cannot Remove the Friend");
            }

            return removed;
        },

        async add_favouriteColor(parent, { data }, { req }, info) {
            let added = false;

            const user = getUser(req);

            try {
                await User.findByIdAndUpdate(user._id, {
                    $push: {
                        Colors: [
                            {
                                ColorId: data.ColorId,
                                Colors: data.Colors,
                                Type: data.Type,
                                UsedBy: data.UsedBy,
                            },
                        ],
                    },
                }).exec();

                added = true;
            } catch {
                throw new Error("Cannot add favourite color");
            }

            return added;
        },

        async add_favouriteGradient(parent, { data }, { req }, info) {
            let updated = false;

            const user = getUser(req);

            try {
                await User.findByIdAndUpdate(user._id, {
                    $push: {
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
                }).exec();

                updated = true;
            } catch {
                throw new Error("Cannot add favourite gradient");
            }

            return updated;
        },

        async remove_favouriteColor(parent, { data }, { req }, info) {
            let removed = false;

            const user = getUser(req);

            try {
                await User.findByIdAndUpdate(user._id, {
                    $pull: { Colors: { ColorId: data.ColorId } },
                }).exec();

                removed = true;
            } catch {
                throw new Error("Cannot remove the color");
            }

            return removed;
        },

        async remove_favouriteGradient(parent, { data }, { req }, info) {
            let removed = false;

            const user = getUser(req);

            try {
                await User.findByIdAndUpdate(user._id, {
                    $pull: { Gradients: { GradientId: data.GradientId } },
                }).exec();

                removed = true;
            } catch {
                throw new Error("Cannot remove Gradient");
            }

            return removed;
        },

        async upload_profile(_, { file }, { req }, info) {
            const { createReadStream, filename } = await file;
            const ext = filename.substr(filename.lastIndexOf(".") + 1);
            const user = getuser(req);
            let fName = user.Username;
            const fileName = fName + "." + ext;
            let uploaded = false;

            try {
                let fPath = path.join(
                    __dirname,
                    "../../files/profile-photos",
                    fName.toString()
                );
                fPath += ".[^" + ext + "]*";

                glob(fPath, function (er, files) {
                    files.forEach((file) => {
                        if (fs.existsSync(file)) fs.unlinkSync(file);
                    });
                });
                if (
                    fs.existsSync(
                        path.join(
                            __dirname,
                            "../../files/profile-photos",
                            fileName
                        )
                    )
                ) {
                    fs.unlinkSync(
                        path.join(
                            __dirname,
                            "../../files/profile-photos",
                            fileName
                        )
                    );
                }
                await new Promise((res) =>
                    createReadStream()
                        .pipe(
                            fs.createWriteStream(
                                path.join(
                                    __dirname,
                                    "../../files/profile-photos",
                                    fileName
                                )
                            )
                        )
                        .on("close", res)
                );
                const Photo = path.join("profile-photos", fileName);

                await User.findByIdAndUpdate(user._id, {
                    Profile: Photo,
                }).exec();

                uploaded = true;
            } catch {
                throw new Error("Cannot upload photo");
            }

            return uploaded;
        },
    },
};
