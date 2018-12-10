module.exports = {
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
        
        var path = require('path');
        var node_name = path.basename(node_level_config).split('.')[1];
        var pop_name = path.basename(pop_level_config).split('.')[1];
        var global_name = 'global';
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
