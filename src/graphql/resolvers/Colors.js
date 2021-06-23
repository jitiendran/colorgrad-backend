const Color = require("../schema/color");

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
        Favourite: false,
        UsedBy: 0,
      });

      await color.save((err, result) => {
        if (err) console.log(err);
      });
      return color;
    },
  },
};
