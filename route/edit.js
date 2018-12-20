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
          <form action="/save" method="post" onsubmit="return submitform()">
            <table border=1 id="config">
              $0
            </table>
            <input type="submit" value="Save">
            <input type="hidden" name="file_dir" id="file_dir" value="$1">
            <input type="hidden" name="file_prefix" id="file_prefix" value="$2">
            <input type="hidden" name="file_ext" id="file_ext" value="$3">
          </form>
          <script>
            function submitform() {
              var configTable = document.getElementById("config");
              var out = "";
              for (var i = configTable.rows.length-1, row; row = configTable.rows[i]; i--) {
                var ipt = row.cells[1].firstChild;
                var changed = false
                if (ipt.value != ipt.defaultValue) {
                  changed = true;
                }
                if (ipt.type == "checkbox") {
                  if (ipt.checked != ipt.defaultChecked) {
                    changed = true;
                    ipt.value = (ipt.value == "true" ? "false" : "true");
                  }
                  ipt.checked = true;
                }
                if (changed == true) {
                  out = out + ipt.name + ";";
                } else {
                  configTable.deleteRow(i);
                }
              }
              var rest = confirm('Do you really want to submit the change: ' + out);
              if (rest == false) {
                location.reload();
              }
              return rest
            }
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
            form += `<tr><td>${group}.${attr}.${file}</td>`;
            form += `    <td><input type="number" name="number.${group}.${attr}.${file}" value="${obj3}"></td></tr>\n`;
          }
          else if (typeof(obj3) === 'boolean') { // hidden is where the post will get data from, checkbox toggles hidden's value 
            var checked = obj3 ? 'checked': "";
            form += `<tr><td>${group}.${attr}.${file}</td>`;
            form += `    <td><input type="checkbox" name="boolean.${group}.${attr}.${file}" value="${obj3}" ${checked}></td></tr>\n`;
          }
          else {
            form += `<tr><td>${group}.${attr}.${file}</td>`;
            form += `    <td><input type="text" name="string.${group}.${attr}.${file}" id="${group}.${attr}.${file}" value="${obj3}"></td></tr>\n`;
          }
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
