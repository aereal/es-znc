var es = new require('elasticsearch').Client({
  keepAlive: false,
});

var INDEX_NAME = 'irc_log';
var TYPE_NAME = 'irc_log_entry';
var SETTINGS = {
  "analysis": {
    "tokenizer": {
      "kuromoji": {
        "type": "kuromoji_tokenizer"
      }
    },
    "analyzer": {
      "kuromoji_analyzer": {
        "type": "custom",
        "tokenizer": "kuromoji_tokenizer"
      }
    }
  }
};
var MAPPINGS = {
  "irc_log_entry": {
    "properties": {
      "body": {
        "type": "string",
        "analyzer": "kuromoji_analyzer",
      },
      "author": {
        "type": "string"
      },
      "timestamp": {
        "type": "date",
        "format": "yyyy-MM-dd'T'HH:mm:ss",
      },
      "channel": {
        "type": "string",
      },
    }
  }
};

es.indices.exists({
  index: 'irc_log',
}, function (err, exists) {
  if (exists) {
    es.indices.putMapping({
      index: INDEX_NAME,
      type: TYPE_NAME,
      body: MAPPINGS,
    }, function (err, res) {
      if (err) throw err;
      console.log(res);
    })
  } else {
    es.indices.create({
      index: INDEX_NAME,
      body: {
        settings: SETTINGS,
        mappings: MAPPINGS,
      },
    }, function (err, res) {
      if (err) throw err;
      console.log(res);
    });
  }
});
