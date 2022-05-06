const user = require('./user');

module.exports.get_profile_data = async function (field, value) {
    try {
        //retrieve data from DB
        return await user.
            findOne({ [field]: value }).
            select({ email: 1, password: 1, username: 1, user_id: 1, timestamp: 1 }).
            lean();
    } catch (error) {
        console.log(error);
    }
}

module.exports.create_user = async function (user_id, username, email, password) {
    try {
        return await user.create({ user_id: user_id, username: username, email: email, password: password });
    } catch (error) {
        console.log(error);
    }
}
