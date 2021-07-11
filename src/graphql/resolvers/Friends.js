const User = require("../schema/user");

module.exports = {
    Query: {
        async get_followers(parent, { data }, { req }, info) {
            let followers = [];

            try {
                const foundUser = await User.findOne({ _id: data.Id }).exec();
                followers = foundUser.Followers;
            } catch {
                throw new Error("Cannot get followers");
            }

            return followers;
        },

        async get_following(parent, { data }, { req }, info) {
            let following = [];

            try {
                const foundUser = await User.findOne({ _id: data.Id }).exec();
                following = foundUser.Following;
            } catch {
                throw new Error("Cannot get Following");
            }

            return following;
        },
    },
};
