
const consoleSilencer = () => {
    Object.keys(console).forEach(function (key) {
        //console[key] = function () {}
    });
}

export default consoleSilencer;