/**
 * Videos schema
 */
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;



// Definition
var videoSchema = new Schema({

    _id: { type: String, unique: true, 'default': shortid.generate},
    videoId: { type: String, required: true },
    quality: { type: String, required: true },
    autoplay: { type: String, required: true },
    loop: { type: String, required: true },
    mute: { type: String, required: true },
    rate: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String, required: true },
    title: { type: String },
    imageUrl: {type: String},
    description: {type: String},
    
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
    
    video.description = "Clip: "  + toTime(video.start) + " to " + toTime(video.end);

    next();

});

function toTime(val){

  val = val.toString();

  var time;

  var sec_num = parseInt(val, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  var fraction = (parseFloat(val) - sec_num).toFixed(2);
  fraction = fraction.toString().substr(fraction.length - 3);
  
  if (hours && minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}

  if (hours)
    time = hours+':'+minutes+':'+ seconds + fraction;
  else if (minutes)
    time = minutes+':'+seconds + fraction;
  else
    time = 0+':'+seconds + fraction;
  return time;
};

// Create & Export
var Video = mongoose.model('Video', videoSchema);
module.exports = Video;