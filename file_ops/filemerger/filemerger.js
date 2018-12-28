module.exports = {
    mergeJsonToFiles: function(delta, dir, prefix, ext) {
        var filepicker = require('../filepicker/filepicker.js');
        var base_json = filepicker.pickAllFiles(dir, prefix, ext);
        var final_json = this.mergeJson(delta, base_json);
        var filesaver = require('../filesaver/filesaver.js');
        filesaver.extractFile(final_json, dir, prefix, ext);
    },
    mergeJson: function(delta_json, base_json) {
        for ( var key0 in delta_json ) {
            for ( var key1 in delta_json[key0] ) {
                for ( var key2 in delta_json[key0][key1] ) {
                    base_json[key0][key1][key2] = delta_json[key0][key1][key2];
                }
            }
        }
        return base_json;
    }
}
