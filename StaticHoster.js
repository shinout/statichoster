/**
 * TODO cope with directory traversal vulnerablity problem
 * TODO HTTP things (cache, ETag, Not-Modified etc...)
 *
 **/
const path  = require('path');
const fs    = require('fs');
const Junjo = require('junjo');

function StaticHoster(public_path, mimes) {
  this.public_path = public_path || process.cwd();
	this.mimes = {
    css       : ['text/css', 'css'],
    js        : ['text/javascript', 'js'],
    png       : ['image/png', 'images'],
    jpg       : ['image/jpeg', 'images'],
    gif       : ['image/gif', 'images'],
    ico       : ['image/vnd.microsoft.icon', ''],
    manifest  : ['text/cache-manifest', '']
	};
	if (typeof mimes == 'object') {
		for (var i in mimes) {
      if (!Array.isArray(mimes[i])) mimes[i] = [mimes[i]];
			this.mimes[i] = mimes[i];
		}
	}
}

StaticHoster.prototype.host = function(req, res, callback) {
  var $j = new Junjo();
  var self = this;
  $j.inputs(["req", "res"]);

  $j("mime", function(req) {
    this.out     = false;
    var ext      = path.extname(req.url).slice(1);
    var urlElems = req.url.split('/');
    urlElems.shift();

    if (!ext) {
      throw new Error("no extension is given.");
      return;
    }

    var mimeInfo = self.mimes[ext];

    if (!mimeInfo) {
      throw new Error(ext + ", no mimetype registered.");
      return;
    }

    if (mimeInfo[1] && urlElems[0] != mimeInfo[1]) { throw new Error() }
    return mimeInfo[0];
  })
  .using("req")
  .fail(function(e) {
    this.err = e;
    this.terminate();
  });

  $j("file", function(mimetype) {
    fs.readFile(self.public_path + req.url, this.cb);
  })
  .eshift()
  .after("mime")
  .fail(function(e, args) {
    var text = '404 not found\n';
    var res = this.inputs[1];
    res.writeHead(404, {'Content-Type' : 'text/plain' });
    res.end(text);

    this.err = e;
    this.out = text;
    this.terminate();
  });

  $j("response", function(mimetype, contents, res) {
    res.writeHead(200, {'Content-Type' : mimetype });
    res.end(contents);
    this.out = contents;
  })
  .using("mime", "file", "res")
  .fail(function(e, args) {
    var text = '500 internal server error\n';
    var res = args[2];
    res.writeHead(500, {'Content-Type' : "text/plain"});
    res.end(text);
    this.err = e;
    this.out = text;
  });

  if (typeof callback != "function") callback = function() {};
  
  return $j.exec(req, res, callback);
};

module.exports = StaticHoster;
