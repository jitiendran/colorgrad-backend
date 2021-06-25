const Days = require("./month");

module.exports = async (total_contribution, total_usage) => {
    return (total_contribution * total_usage) / Days();
};
