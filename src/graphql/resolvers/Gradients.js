const Gradient = require("../schema/gradient");
const User = require("../schema/user");
const Rating = require("../functions/rating");
const Uses = require("../functions/usedby");
const Contributions = require("../functions/contribution");
const FindUser = require("../functions/finduser_by_gradient");

module.exports = {
    Query: {
        async getGradients() {
            let gradients = await Gradient.find({}).lean();
            return gradients;
        },

        async getMyGradients(parent, args, context, info) {
            let gradient = null;
            await Gradient.find({ UserId: args.data.UserId }, (err, result) => {
                if (err) console.log(err);
                else {
                    gradient = result;
                }
            });
            return gradient;
        },
    },
    Mutation: {
        async insertGradient(parent, args, context, info) {
            const gradient = new Gradient({
                UserId: args.data.UserId,
                Colors: args.data.Colors,
                Type: args.data.Type,
                Direction: args.data.Direction,
                UsedBy: 0,
            });

            await gradient.save(async (err, result) => {
                if (err) console.log(err);
                else {
                    try {
                        await User.findByIdAndUpdate(
                            { _id: args.data.UserId },
                            { $inc: { No_Of_Gradients: 1 } },
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
                        throw new Error("Cannot Update Rating");
                    }
                }
            });
            return gradient;
        },

        async copyGradient(contact, args, context, info) {
            let update = false;
            try {
                await Gradient.findByIdAndUpdate(
                    { _id: args.data.GradientId },
                    { $inc: { UsedBy: 1 } },
                    { upsert: true, new: true }
                ).exec();

                update = true;

                const UserId = await FindUser(args.data.GradientId);

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
                return update;
            } catch {
                throw new Error("Cannot copy Gradient");
            }
        },
    },
};
