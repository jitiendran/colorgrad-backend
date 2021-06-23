const Gradient = require("../schema/gradient");
module.exports = {
  Query: {
    async getGradients() {
      let gradients = [];
      await Gradient.find({}, (err, result) => {
        if (err) console.log(err);
        else {
          gradients = result;
        }
      });
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
      let results = null;
      const gradient = new Gradient({
        UserId: args.data.UserId,
        Colors: args.data.Colors,
        Type: args.data.Type,
        Direction: args.data.Direction,
        Favourite: false,
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
