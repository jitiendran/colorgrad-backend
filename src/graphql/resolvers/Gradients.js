import getUser from "../auth/getuser";
import Gradient from "../schema/gradient";
import User from "../schema/user";
import Rating from "../functions/rating";
import Uses from "../functions/usedby";
import Contributions from "../functions/contribution";

module.exports = {
    Query: {
        async getGradients() {
            let gradients = null;
            try {
                gradients = await Gradient.find({}).lean();
            } catch {
                throw new Error("Cannot get Gradients");
            }
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
        async getFavouriteGradients(parent, args, { req }, info) {
            const user = getUser(req);

            const myUser = await User.findOne({ _id: user._id }).exec();

            return myUser.Gradients;
        },
    },
    Mutation: {
        async insertGradient(parent, { data }, context, info) {
            const gradient = new Gradient({
                UserId: data.UserId,
                Colors: data.Colors,
                Type: data.Type,
                Direction: data.Direction,
                UsedBy: 0,
            });

            let IsInserted = false;

            try {
                await gradient.save();

                await User.findByIdAndUpdate(
                    data.UserId,
                    { $inc: { No_Of_Gradients: 1 } },
                    { upsert: true, new: true }
                ).exec();

                IsInserted = true;

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
                throw new Error("Cannot Update Rating");
            }
            return IsInserted;
        },

        async copyGradient(contact, { data }, context, info) {
            let update = false;
            try {
                await Gradient.findByIdAndUpdate(
                    { _id: data.GradientId },
                    { $inc: { UsedBy: 1 } },
                    { upsert: true, new: true }
                ).exec();

                update = true;

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
                return update;
            } catch {
                throw new Error("Cannot copy Gradient");
            }
        },
    },
};
