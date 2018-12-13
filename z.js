#!/usr/bin/env node

var url = require("url");
var fs = require("fs");


var server = require('http').createServer();

server.on("request", function(req, res) {
    try
    {

        var parts = url.parse(req.url, true);

	// debugging output to server standard out
        var event = new Date();
        console.log(event.toString());

	console.log(parts.pathname);
	console.log(JSON.stringify(parts.query));
	
	var content = '';
	
        // Get the config file...
	if (parts.pathname == '/edit')
	{
            var dir = parts.query['dir']; 
            var prefix = parts.query['prefix']; 
            var ext = parts.query['ext'];
	    var name = parts.query['filename']
            var edit = require('./route/edit.js');
	    if (name) // I could NOT get the filepicker to work. Need to add help or something. Use actual name here:
		content = edit.fileHandler(name);
	    else
		content = edit.editHandler(dir, prefix, ext);
	}
	else if (parts.pathname == '/file')
	{
            var filename = parts.query['dir']; 
            content = edit.fileHandler(dir, prefix, ext);
	}
	else if (parts.pathname == '/save')
	{
            var save = require('./route/save.js');
            save.saveHandler(req, res);
            content = "";
	}
	else
	{
	    content = "Do NOT Support";
	}
	
        if(content!==""){
          res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'keep-alive', 'Content-length': content.length});
          res.end(content);
        }
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
