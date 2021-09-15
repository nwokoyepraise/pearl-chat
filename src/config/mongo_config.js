
const mongoose = require('mongoose');

module.exports = mongoose.createConnection('mongodb://localhost/pcdb',
    function (err, res) {
        if (!err) {
            console.log('connected to mongo!');
        } else {
            console.log(err);
        }
    });