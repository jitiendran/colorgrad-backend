import getUser from "../auth/getuser";
import User from "../schema/user";

module.exports = {
    Query: {
        async get_followers(parent, args, { req }, info) {
            let followers = [];

            const user = getUser(req);

            try {
                const foundUser = await User.findOne({ _id: user._id }).exec();
                followers = foundUser.Followers;
            } catch {
                throw new Error("Cannot get followers");
            }

            return followers;
        },

        async get_following(parent, args, { req }, info) {
            let following = [];

            const user = getUser(req);

            try {
                const foundUser = await User.findOne({ _id: user._id }).exec();
                following = foundUser.Following;
            } catch {
                throw new Error("Cannot get Following");
            }

            return following;
        },
    },
};
