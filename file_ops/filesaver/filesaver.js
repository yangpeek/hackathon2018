module.exports = {
    genObject: function(leading_file_obj, file, key0, key1, obj) {
      if (leading_file_obj[file] === undefined) {
        leading_file_obj[file] = {}
      }
      if (leading_file_obj[file][key0] === undefined) {
        leading_file_obj[file][key0] = {}
      }
      leading_file_obj[file][key0][key1] = obj;
    },
    extractFile: function(ending_file_obj, dir, prefix, ext) {
      var leading_file_obj = {}
      for (var key0 in ending_file_obj) {
        obj0 = ending_file_obj[key0];
        for (var key1 in obj0) {
          obj1 = obj0[key1];
          for (var file in obj1) {
            this.genObject(leading_file_obj, file, key0, key1, obj1[file])
          }
        }
      }
      this.saveFile(leading_file_obj, dir, prefix, ext);
    },
    genFileName: function(file, dir, prefix, ext) {
      full_file = ""
      if (file == "global") {
        full_file = dir + "/" + prefix + "." + ext;
      } else {
        full_file = dir + "/" + prefix + "." + file + "." + ext;
      }
      return full_file;
    },
    saveFile: function(leading_file_obj, dir, prefix, ext) {
      var fs = require('fs');
      for (var key0 in leading_file_obj) {
        var full_file_name = this.genFileName(key0, dir, prefix, ext);
        var file_obj = leading_file_obj[key0];
	console.log(full_file_name, JSON.stringify(file_obj));
        fs.writeFile(full_file_name, JSON.stringify(file_obj, null, 4), function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log('Replaced!');
          }
        });
      }
    }
}
