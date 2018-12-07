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
    extractFile: function(ending_file_obj) {
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
      this.saveFile(leading_file_obj);
    },
    genFileName: function(file) {
      full_file = ""
      file_prefix = "config."
      file_ext = "json"
      if (file == "global") {
        full_file = file_prefix + file_ext;
      } else {
        full_file + file_prefix + file + "." + file_ext;
      }
      return full_file;
    },
    saveFile: function(leading_file_obj) {
      var fs = require('fs');
      for (var key0 in leading_file_obj) {
        var full_file_name = this.genFileName(key0);
        var file_obj = leading_file_obj[key0];
	console.log(full_file_name, JSON.stringify(file_obj));
        fs.writeFile(full_file_name, JSON.stringify(file_obj), function (err) {
          if (err) throw err;
          console.log('Replaced!');
        });
      }
    }
}
