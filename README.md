statichoster
==========
[Node.js] hosting static files in a public directory

### Installation ###
    git clone git://github.com/shinout/statichoster.git

    OR

    npm install statichoster

### Usage ###
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

### set public directory ###
    // the first argument of constructor
    var sh = new StaticHoster(__dirname + "/public");

### set filetypes ###
    // the first argument of constructor
    var sh = new StaticHoster(__dirname + "/public", {
      html : "text/plain", // extension name => mime-type

      tiff : ["image/tiff, images] // extension name => [ mime-type, name of the subdirectory ]
    });

### original filetypes ###
    // extension name => [mime-type, name of the subdirectory]
    css       : ['text/css', 'css'],
    js        : ['text/javascript', 'js'],
    png       : ['image/png', 'images'],
    jpg       : ['image/jpeg', 'images'],
    gif       : ['image/gif', 'images'],
    ico       : ['image/vnd.microsoft.icon', ''],
    manifest  : ['text/cache-manifest', '']
