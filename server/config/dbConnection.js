const { default: mongoose } = require("mongoose");
require('dotenv').config()

exports.connect = async () => {
    try {
        const res = await mongoose.connect(process.env.MONGODB_URL)
        if (res) {
            console.log("DB Connected");
        }
    } catch (error) {
        console.log(error);
    }
}