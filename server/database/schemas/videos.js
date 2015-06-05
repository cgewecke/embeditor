/**
 * Videos schema
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Definition
var videoSchema = new Schema({

    videoId: { type: String, required: true },
    quality: { type: String, required: true },
    autoplay: { type: String, required: true },
    loop: { type: String, required: true },
    mute: { type: String, required: true },
    rate: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    created_at: {type: Date},
    updated_at: {type: Date},

    width: { type: Number},
    height: { type: Number},
    iv_load_policy: { type: Number},
    controls: { type: Number},
    disablekb: { type: Number},
    fs: { type: Number},
    rel: { type: Number},
    modestbranding: { type: Number}, 
    showinfo: { type: Number}

});

// Creation/Update times
videoSchema.pre('save', function (next) {

    console.log("In videoSchema pre");

    var video = this;
    var currentDate = new Date();

    video.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!video.created_at)
        video.created_at = currentDate;

    video.iv_load_policy = 3;
    video.controls = 0;
    video.disablekb =1;
    video.fs = 0;
    video.rel = 0;
    video.modestbranding = 1; 
    video.showinfo = 0;

    next();

});


// Create & Export
var Video = mongoose.model('Video', videoSchema);
module.exports = Video;