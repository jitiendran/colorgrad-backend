const User = require("../schema/user");

module.exports = async (id) => {
    let user = null;
    await User.findOne({ _id: id }, (err, result) => {
        if (err) console.log(err);
        else {
            user = result;
        }
    });
    return user.No_Of_Colors + user.No_Of_Gradients;
};
