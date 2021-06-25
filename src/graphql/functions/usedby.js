const Color = require("../schema/color");
const Gradient = require("../schema/gradient");

module.exports = async (id) => {
    let color = [],
        gradient = [],
        used = 0;

    await Color.find({ UserId: id }, (err, result) => {
        if (err) console.log(err);
        else {
            color = result;
            for (let i = 0; i < color.length; i++) {
                used += color[i].UsedBy;
            }
        }
    });

    await Gradient.find({ UserId: id }, (err, result) => {
        if (err) console.log(err);
        else {
            gradient = result;
            for (let i = 0; i < gradient.length; i++) {
                used += gradient[i].UsedBy;
            }
        }
    });

    return used;
};
