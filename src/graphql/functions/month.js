module.exports = () => {
    const date = new Date();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return new Date(year, month, 0).getDate();
};
