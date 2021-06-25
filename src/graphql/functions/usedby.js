const Color = require("../schema/color");

module.exports = async (id) => {
    let color = [],
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
    return used;
};
