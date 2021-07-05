import getUser from "../auth/getuser";
import Color from "../schema/color";
import User from "../schema/user";
import Rating from "../functions/rating";
import Uses from "../functions/usedby";
import Contributions from "../functions/contribution";

module.exports = {
    Query: {
        async getColors() {
            let colors = null;
            try {
                colors = await Color.find({}).lean();
            } catch {
                throw new Error("Cannot get Colors");
            }
            return colors;
        },

        async getMyColors(parent, args, context, info) {
            let colors = [];
            await Color.find({ UserId: args.data.UserId }, (err, result) => {
                if (err) console.log(err);
                else {
                    colors = result;
                }
            });
            return colors;
        },

        async getPopularColors(parent, args, context, info) {
            let colors = await Color.find({}).lean();
            return colors;
        },

        async getFavouriteColors(parent, { data }, { req }, info) {
            const user = getUser(req);

            const myUser = await User.findOne({ _id: user._id }).exec();

            return myUser.Colors;
        },
    },
    Mutation: {
        async insertColors(parent, { data }, context, info) {
            const color = new Color({
                UserId: data.UserId,
                Colors: data.Colors,
                Type: data.Type,
                UsedBy: 0,
            });

            let inserted = false;

            try {
                await color.save();

                await User.findByIdAndUpdate(
                    { _id: data.UserId },
                    { $inc: { No_Of_Colors: 1 } },
                    { upsert: true, new: true }
                ).exec();

                console.log("Updated !!!");

                inserted = true;

                await User.findByIdAndUpdate(
                    { _id: data.UserId },
                    {
                        Rating: await Rating(
                            await Contributions(data.UserId),
                            await Uses(data.UserId)
                        ),
                    },
                    { new: true }
                ).exec();
            } catch {
                throw new Error("Cannot update Rating");
            }
            return inserted;
        },

        async copyColors(parent, { data }, context, info) {
            let updated = false;
            try {
                await Color.findByIdAndUpdate(
                    data.ColorId,
                    { $inc: { UsedBy: 1 } },
                    { upsert: true, new: true }
                ).exec();

                updated = true;

                await User.findByIdAndUpdate(
                    data.UserId,
                    {
                        Rating: await Rating(
                            await Contributions(data.UserId),
                            await Uses(data.UserId)
                        ),
                    },
                    { new: true }
                ).exec();
            } catch {
                throw new Error("Cannot update");
            }
            return updated;
        },
    },
};
