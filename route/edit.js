module.exports = {
  editHandler: function(dir, prefix, ext) {
    var filepicker = require('../file_ops/filepicker/filepicker.js');
    var json_obj = filepicker.pickAllFiles(dir, prefix, ext);
    var form = this.JSON_to_FORM(json_obj);

    Templates = {
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
              <input type="hidden" name="file_dir" id="file_dir" value="$1">
              <input type="hidden" name="file_prefix" id="file_prefix" value="$2">
              <input type="hidden" name="file_ext" id="file_ext" value="$3">
            </form>
          </script>
        </body>
      </html>`,

      "save": ``,

      "menu": ``
    };
    return this.Sprintf(Templates["edit"], [form, dir, prefix, ext]);
  },

  JSON_to_FORM: function(obj0) {
    var form = '';
    for (var group in obj0) {
      var obj1 = obj0[group];
      for (var attr in obj1) {
        var obj2 = obj1[attr];
        for (var file in obj2) {
          var obj3 = obj2[file];
          if (typeof(obj3) === 'number') {
            form += `<tr><td>${group}.${attr}.${file}</td><td><input type="number" name="number.${group}.${attr}.${file}" value="${obj3}"></td></tr>\n`;
          }
          else if (typeof(obj3) === 'boolean') { // hidden is where the post will get data from, checkbox toggles hidden's value 
            form += `<tr>`;
            form += `<input type="hidden" name="boolean.${group}.${attr}.${file}" id="${group}.${attr}.${file}" value="${obj3}">`;
            var checked = obj3 ? 'checked': "";
            form += `<td>${group}.${attr}.${file}</td><td><input type="checkbox" value="false" ${checked} onclick='v = document.getElementById("${group}.${attr}.${file}"); (v.value = (v.value=="true"?"false":"true"));' ></tr></tr>\n`;
          }
          else
            form += `<tr><td>${group}.${attr}.${file}</td><td><input type="string" name="string.${group}.${attr}.${file}" value="${obj3}"></td></tr>\n`;
        }
      }
    }
    return form;
  }, 

  Sprintf: function(format, args) {
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
  
}
