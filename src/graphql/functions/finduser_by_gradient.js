const Gradient = require("../schema/gradient");

module.exports = async (GradientId) => {
    let UserId = null;
    await Gradient.findOne({ _id: GradientId }, (err, result) => {
        if (err) console.log(err);
        else {
            UserId = result.UserId;
        }
    });
    return UserId;
};
