function Parser () {
  this.PATTERN = /^\[(\d{2}:\d{2}:\d{2})\]\s*(?:\*{3}\s*(?:(\w+)s: (\w+) (.+)|(\w+) is now known as (\w+))|(?:<(\w+)>|-(\w+)-)\s*(.+))/;
}
Parser.prototype.parseLine = function (line) {
  var matched = this.PATTERN.exec(line);
  if (!matched) return { valid: false, line: line };
  if (matched[7]) { // privmsg
    return { valid: true, type: 'privmsg', timestamp: matched[1], author: matched[7], body: matched[9] };
  } else if (matched[8]) { // notice
    return { valid: true, type: 'notice', timestamp: matched[1], author: matched[8], body: matched[9] };
  } else if (matched[5] && matched[6]) { // nick change
    return { valid: true, type: 'nick_change', old_nick: matched[5], new_nick: matched[6] };
  } else if (matched[2]) { // other events
    return { valid: true, type: matched[2].toLowerCase(), author: matched[3], body: matched[4] };
  } else {
    return { valid: false };
  }
};
Parser.prototype.parse = function (body) {
  return body.split("\n").map(function (line) { return this.parseLine(line) }, this);
};

module.exports = Parser;
