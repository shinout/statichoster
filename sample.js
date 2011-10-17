var http = require("http");
var StaticHoster = require("./StaticHoster");
var sh = new StaticHoster(__dirname + "/public", {
  html: "text/html"
});

var server = http.createServer(function(req, res) {
  sh.host(req, res, function(err, result) {
    // if error
    if (err) console.log(err);

    // if statichoster write something to response
    if (result) return;

    // if statichoster do nothing
    res.writeHead(200, {'Content-Type' : 'text/plain' });
    res.end("other types of request\n");
  });
});

server.listen(1192);
