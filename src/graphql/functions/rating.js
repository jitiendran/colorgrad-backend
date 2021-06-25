const Days = require("./month");

module.exports = async (total_contribution, total_usage) => {
    // console.log("Total Contribution : ", total_contribution);
    // console.log("Total Usage : ", total_usage);
    // console.log("No Of Days : ", Days());

    return (total_contribution * total_usage) / Days();
};
