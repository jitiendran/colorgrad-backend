const Color = require("../schema/color");
const User = require("../schema/user");
const Rating = require("../functions/rating");
const Uses = require("../functions/usedby");
const Contributions = require("../functions/contribution");
const FindUser = require("../functions/finduser");

module.exports = {
    Query: {
        async getColors() {
            let colors = null;
            await Color.find({}, (err, result) => {
                if (err) console.log(err);
                else {
                    colors = result;
                }
            });
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
    },
    Mutation: {
        async insertColors(parent, args, context, info) {
            const color = new Color({
                UserId: args.data.UserId,
                Colors: args.data.Colors,
                Type: args.data.Type,
                UsedBy: 0,
            });

            await color.save(async (err, result) => {
                if (err) console.log(err);
                else {
                    try {
                        await User.findByIdAndUpdate(
                            { _id: args.data.UserId },
                            { $inc: { No_Of_Colors: 1 } },
                            { upsert: true, new: true }
                        ).exec();

                        console.log("Updated !!!");

                        await User.findOneAndUpdate(
                            { _id: args.data.UserId },
                            {
                                Rating: await Rating(
                                    await Contributions(args.data.UserId),
                                    await Uses(args.data.UserId)
                                ),
                            },
                            { new: true },
                            (err, result) => {
                                console.log("Rated");
                            }
                        );
                    } catch {
                        throw new Error("Cannot update Rating");
                    }
                }
            });
            return color;
        },

        async copyColors(parent, args, context, info) {
            let updated = false;
            try {
                await Color.findByIdAndUpdate(
                    { _id: args.data.ColorId },
                    { $inc: { UsedBy: 1 } },
                    { upsert: true, new: true }
                ).exec();

                updated = true;

                const UserId = await FindUser(args.data.ColorId);

                await User.findOneAndUpdate(
                    { _id: UserId },
                    {
                        Rating: await Rating(
                            await Contributions(UserId),
                            await Uses(UserId)
                        ),
                    },
                    { new: true },
                    (err, result) => {
                        console.log("Rated");
                    }
                );
            } catch {
                throw new Error("Cannot update");
            }
            return updated;
        },
    },
};
