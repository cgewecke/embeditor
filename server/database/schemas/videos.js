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
    created_at: {type: Date, required: true },
    updated_at: {type: Date, required: true },

    width: { type: Number, required: true },
    height: { type: Number, required: true },
    iv_load_policy: { type: Number, required: true },
    controls: { type: Number, required: true },
    disablekb: { type: Number, required: true },
    fs: { type: Number, required: true },
    rel: { type: Number, required: true },
    modestbranding: { type: Number, required: true }, 
    showinfo: { type: Number, required: true },

    
});

// Creation/Update times
videoSchema.pre('save', function (next) {

    var video = this;
    var currentDate = new Date();

    this.updated_at = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;

    this.iv_load_policy = 3;
    this.controls = 0;
    this.disablekb =1;
    this.fs = 0;
    this.rel = 0;
    this.modestbranding = 1; 
    this.showinfo = 0;

    next();


});


// Create & Export
var Video = mongoose.model('Video', videoSchema);
module.exports = Video;