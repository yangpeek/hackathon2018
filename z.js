#!/usr/bin/env node

var url = require("url");
var fs = require("fs");

var Templates = {
    "edit":
    `<html>
        <head>
        <link rel="shortcut icon" href="#" />
        <!-- link rel="stylesheet" href="hackathon.css" -->
        </head>
        <body>
        <script>console.log("loaded");</script>
        <form action="/save" method="post">
        <table border=1>
        $0
        </table>
        <input type="submit" value="Save" onclick="submitform()">
        </form>
        </script>
        </body>
        </html>
        `,

    "save": ``,

    "menu": ``
};

function JSON_to_FORM(j)
{
    var obj0 = JSON.parse(j);
    var form = '';
    //var form = `<script>function toggle_tfstring(element, attribute) { element[attribute] = element[attribute] == "true" ? "false" : "true"; }; </script>`;
    for (var key0 in obj0)
    {
        var obj1 = obj0[key0];
        for (var key1 in obj1)
	{
            var obj2 = obj1[key1];
	    if (typeof(obj2) === 'number')
	    {
		form += `<tr><td>${key0}.${key1}</td><td><input type="number" name="number.${key0}.${key1}" value="${obj2}"></td></tr>\n`;
	    }
	    else if (typeof(obj2) === 'boolean') // hidden is where the post will get data from, checkbox toggles hidden's value
	    {   form += `<tr>`;
                form += `<input type="hidden" name="boolean.${key0}.${key1}" id="${key0}.${key1}" value="${obj2}">`;
		var checked = obj2 ? 'checked': "";
		form += `<td>${key0}.${key1}</td><td><input type="checkbox" value="false" ${checked} onclick='v = document.getElementById("${key0}.${key1}"); (v.value = (v.value=="true"?"false":"true"));' ></tr></tr>\n`;
	    }
	    else
		form += `<tr><td>${key0}.${key1}</td><td><input type="string" name="string.${key0}.${key1}" value="${obj2}"></td></tr>\n`;
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
            var file_to_edit = fs.readFileSync("./"+parts.query['file']);
            var form = JSON_to_FORM(file_to_edit);
            var content = Sprintf(Templates["edit"], [form])
	}
	else if (parts.pathname == '/save')
	{
            var save = require('./route/save.js');
            var body = save.saveHandler(req,res);
            console.log(body);
	}
	else
	{
	    var content = "Do NOT Support";
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
