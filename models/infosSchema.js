const mongoose = require('mongoose');

const infoSchema = new mongoose.Schema({
    title:String,
    description:String,
    engine:String,
    platform:String,
    downloadLink:String
});
const gameInfo = mongoose.model('gameInfo', infoSchema);

// Export the Info model
module.exports =gameInfo;