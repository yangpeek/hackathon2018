#!/usr/bin/env node

var url = require("url");
var fs = require("fs");

var Templates = {
    "edit":
    `<html>
        <head>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://raw.githubusercontent.com/daffl/jquery.dform/master/dist/jquery.dform-1.1.0.js"></script>
        </head>
        <body>
        <form>
        <table border=1>
        $0
        </form>
        </table>
        <input type="submit" value="Save">
        </script>
        </body>
        </html>
        `,

    "save": ``,

    "menu": ``
};

function JSON_to_FORM(j) {
    var obj0 = JSON.parse(j);
    var form = "";
    for (var key0 in obj0) {
        var obj1 = obj0[key0];
        for (var key1 in obj1) {
            var obj2 = obj1[key1];
            form += `<tr><td>${key0}.${key1}</td><td><input type=string name=${key0}.${key1} value=${obj2}></td></tr>\n`;
        }
    }
    return form;
}

function Sprintf(format, args)
{
    if (typeof args == 'undefined')
	args = new Array()
    else if (!(args instanceof Array))
	args = new Array(args);

    var end = args.length;

    format = format.replace(/\$([0-9])+\*/g, function(junk, which) {
        end = which; // don't individually relace any arg after which
        return args.slice(which).toString();
    });

    format = format.replace(/\$(\d)/g, function(match, index) {
        //console.log(match+":"+index);
        if (args[index] == null)
            return match;
        return args[index].toString();
    });

    return  format;
}

var server = require('http').createServer();

server.on("request", function(req, res) {
    try
    {
        var remote = req.socket.remoteAddress+":"+req.socket.remotePort;

        var parts = url.parse(req.url, true);

	// debugging output to server standard out
	console.log(parts.pathname);
	console.log(JSON.stringify(parts.query));
	console.log(req.content);
	
	var content = '';
	
        // Get the config file...
	if (parts.pathname == '/edit') {
            var file_to_edit = fs.readFileSync("./"+parts.query['file']);
            var form = JSON_to_FORM(file_to_edit);
            var content = Sprintf(Templates["edit"], [form])
	}
	
        // Get the config file...
	if (parts.pathname == '/save') {
            var file_to_edit = fs.readFileSync("./"+parts.query['file']);
            var form = JSON_to_FORM(file_to_edit);
            var content = Sprintf(Templates["edit"], [form])
	}

        res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'keep-alive', 'Content-length': content.length});
        res.end(content);
    }
    catch(ex)
    {
        payload = ex.toString() + "\n" + JSON.stringify(parts)+"\n";
        res.writeHead(400, {'Content-Type': 'text/html', 'Connection': 'keep-alive', 'Content-length': payload.length});
        res.end(payload);
    }
});

server.listen(8088, '', 30, function(info) {
    console.log("Listening on port 8088");
});
