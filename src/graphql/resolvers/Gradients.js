const Gradient = require("../schema/gradient");
module.exports = {
  Query: {
    async getGradients(parent, args, context, info) {
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
      let results = null;
      const gradient = new Gradient({
        UserId: args.data._id,
        Colors: args.data.Colors,
        Type: args.data.Type,
        Direction: args.data.Direction,
        UsedBy: 0,
      });

      await gradient.save((err, result) => {
        if (err) console.log(err);
        else {
          results = result;
        }
      });
      return gradient;
    },
  },
};
