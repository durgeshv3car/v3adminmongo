const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    carUrl: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Banner', BannerSchema);