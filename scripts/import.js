var path = require('path');
var fs = require('fs');
var es = new require('elasticsearch').Client({
  keepAlive: false,
});
var Parser = require(path.join(__dirname, '../src/parser'));

var INDEX_NAME = 'irc_log';
var TYPE_NAME = 'irc_log_entry';
var PATTERN = /^(.+)_(.+)_(\d{4})(\d{2})(\d{2})\.log$/;

var logFileName = process.argv.slice(2)[0];

var matched = PATTERN.exec(path.basename(logFileName))
if (!matched) throw 'Invalid logFileName';
var date    = matched.slice(3).join('-');
var channel = matched[2];

var parser = new Parser();

fs.readFile(logFileName, function (err, buf) {
  if (err) throw err;
  var parsed = parser.parse(buf.toString());
  var messages = parsed.filter(function (entry) { return entry.type === 'privmsg' || entry.type === 'notice' });
  var importJobs = messages.map(function (message) {
    return {
      author: message.author,
      body: message.message,
      timestamp: [date, message.timestamp].join('T'),
      channel: channel,
    };
  });
  importJobs.forEach(function (job) {
    // XXX bulk not supported
    es.index({
      index: INDEX_NAME,
      type: TYPE_NAME,
      body: job,
    }, function (err, res) {
      if (err) throw err;
      console.log(res);
    });
  });
});
