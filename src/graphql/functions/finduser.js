const Color = require("../schema/color");

module.exports = async (ColorId) => {
    let userId = null;

    await Color.findOne({ _id: ColorId }, (err, result) => {
        if (err) console.log(err);
        else {
            userId = result.UserId;
        }
    });

    return userId;
};
