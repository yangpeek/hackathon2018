module.exports = {
    fileName: function(file_name) {
        var path = require('path');
        var array = path.basename(file_name).split('.');
        if ( array.length < 3 ) {
            return 'global';
        } else {
            return array[1];
        }
    },
 
    findFiles: function(dir, prefix, ext) {
        var fs = require('fs');
        var files = fs.readdirSync(dir).filter(fn => fn.startsWith(prefix)).filter(fn => fn.endsWith("." + ext));
        files.reverse();
        return files;
    },
  
    genObject: function(ending_file_obj, file, key0, key1, obj) {
      if (ending_file_obj[key0] === undefined) {
        ending_file_obj[key0] = {}
      }
      if (ending_file_obj[key0][key1] === undefined) {
        ending_file_obj[key0][key1] = {}
      }
      ending_file_obj[key0][key1][file] = obj;
    },

    pickAllFiles: function(dir, prefix, ext) {
        var fs = require('fs');
        files = this.findFiles(dir, prefix, ext); 
        console.log(files);
        var config = {};
        for ( let file of files ) {
            var full_file_name = dir + "/" + file;
            console.log("pick file: " + full_file_name);
            var file_level = this.fileName(full_file_name);
            try {
                var obj = JSON.parse(fs.readFileSync(full_file_name));
                for ( var key0 in obj ) {
                    for ( var key1 in obj[key0] ) {
                        this.genObject(config, file_level, key0, key1, obj[key0][key1]);
                    }
                }
            }
            catch(e) {
              console.log("file: " + full_file_name + " is invalid!");
            }
        }
        return config;
    },

    pickFile: function(node_level_config, pop_level_config, global_config) {
        var fs = require('fs');
        var node_level_obj = new Object();
        if (node_level_config) {
            node_level_obj = JSON.parse(fs.readFileSync(node_level_config));
        }
        var pop_level_obj = new Object();
        if (pop_level_config) {
            pop_level_obj = JSON.parse(fs.readFileSync(pop_level_config));
        }
        var global_obj = new Object();
        if (global_config) {
            global_obj = JSON.parse(fs.readFileSync(global_config));
        }
        
        var node_name = this.fileName(node_level_config);
        var pop_name = this.fileName(pop_level_config);
        var global_name = this.fileName(global_config);
        var new_config = new Object();

        for (var key0 in node_level_obj) {
            new_config[key0] = new Object();
            if (key0 in global_obj) {
                for (var key1 in node_level_obj[key0]) {
                    new_config[key0][key1] = new Object();
                    new_config[key0][key1][node_name] = node_level_obj[key0][key1];
                    if (key1 in global_obj[key0]) {
                        new_config[key0][key1][global_name] = global_obj[key0][key1];
                    }
                }
            } else {
                new_config[key0] = node_level_obj[key0];
            }
        }

        for (var key0 in pop_level_obj) {
            if (!(key0 in new_config)) {
                new_config[key0] = new Object();
            }
            if (key0 in global_obj) {
                for (var key1 in pop_level_obj[key0]) {
                    if (!(key1 in new_config[key0])) {
                        new_config[key0][key1] = new Object();
                    }
                    new_config[key0][key1][pop_name] = pop_level_obj[key0][key1];
                    if (key1 in global_obj[key0]) {
                        new_config[key0][key1][global_name] = global_obj[key0][key1];
                    }
                }
            } else {
                new_config[key0] = pop_level_obj[key0];
            }
        }

        for (var key0 in global_obj) {
            if (!(key0 in new_config)) {
                new_config[key0] = new Object();
                new_config[key0] = global_obj[key0];
            }
        }

        return JSON.stringify(new_config);
    }
}
