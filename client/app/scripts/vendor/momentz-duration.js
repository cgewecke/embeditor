// jshint ignore: start
//https://www.npmjs.com/package/moment-duration
(function () {
  var moment = (typeof require === 'undefined') ? this.moment : require('moment');
  var iso8601 = '^P(?:([0-9]+W)|([0-9]+Y)?([0-9]+M)?([0-9]+D)?(?:T([0-9]+H)?([0-9]+M)?([0-9]+S)?([0-9]+Z)?)?)$';

  moment.isoDuration = function (text) {
    var matches = text.match(iso8601);
    return moment.duration({
      weeks: parseInt(matches[1], 10),
      years: parseInt(matches[2], 10),
      months: parseInt(matches[3], 10),
      days: parseInt(matches[4], 10),
      hours: parseInt(matches[5], 10),
      minutes: parseInt(matches[6], 10),
      seconds: parseInt(matches[7], 10),
      milliseconds: parseInt(matches[8], 10)
    });
  };

  moment.duration.fn.toISOString = function () {
    function append(number, suffix) {
      return number > 0 ? (number + suffix) : '';
    }

    return 'P' +
        (this.days() % 7 !== 0 ? '' : append(Math.abs(this.weeks()), 'W')) +
        append(Math.abs(this.years()), 'Y') +
        append(Math.abs(this.months()), 'M') +
        (this.days() % 7 === 0 ? '' : append(Math.abs(this.days()), 'D')) +
        ((Math.abs(this.hours()) + Math.abs(this.minutes()) + Math.abs(this.seconds()) + Math.abs(this.milliseconds()) > 0) ? 'T' : '') +
        append(Math.abs(this.hours()), 'H') +
        append(Math.abs(this.minutes()), 'M') +
        append(Math.abs(this.seconds()), 'S') +
        append(Math.abs(this.milliseconds()), 'Z');
  };
}(this));

String.prototype.toHHMMSS = function () {
  var time;
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours && minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}

  if (hours)
    time = hours+':'+minutes+':'+seconds;
  else if (minutes)
    time = minutes+':'+seconds;
  else
    time = 0+':'+seconds;
  return time;
};

String.prototype.toHHMMSSss = function () {
  var time;

  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  var fraction = (parseFloat(this) - sec_num).toFixed(2);
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