function Parser () {
  this.eventPattern = /^\[(\d{2}:\d{2}:\d{2})\]\s*\*{3}\s*(\w+)s:\s*(.+)$/;
  this.nickChangePattern = /^\[(\d{2}:\d{2}:\d{2})\]\s*\*{3}\s*([a-zA-Z0-9_\-]+) is now known as ([a-zA-Z0-9_\-]+)/;
  this.privmsgPattern = /^\[(\d{2}:\d{2}:\d{2})\]\s*<([a-zA-Z0-9_\-]+)> (.+)/;
  this.noticePattern = /^\[(\d{2}:\d{2}:\d{2})\]\s*-([a-zA-Z0-9_\-]+)- (.+)/;
}
Parser.prototype.parseLine = function (line) {
  var m;
  if (m = this.eventPattern.exec(line)) {
    return { timestamp: m[1], type: m[2].toLowerCase(), message: m[3], line: line };
  }
  if (m = this.nickChangePattern.exec(line)) {
    return { timestamp: m[1], type: 'nick_change', old_nick: m[2], new_nick: m[3], line: line };
  }
  if (m = this.privmsgPattern.exec(line)) {
    return { timestamp: m[1], type: 'privmsg', author: m[2], message: m[3], line: line };
  }
  if (m = this.noticePattern.exec(line)) {
    return { timestamp: m[1], type: 'notice', author: m[2], message: m[3], line: line };
  }
  return { type: 'unknown', line: line };
};
Parser.prototype.parse = function (body) {
  return body.split("\n").map(function (line) { return this.parseLine(line) }, this);
};

module.exports = Parser;
