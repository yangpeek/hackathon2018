#!/usr/bin/env node

var filePicker = require('./filepicker.js');
var node_level_config = '';
var pop_level_config = './config/config.ewr.json';
var global_level_config = './config/config.json';
var result = filePicker.pickFile(node_level_config, pop_level_config, global_level_config);
var result2 = filePicker.pickAllFiles("config/", "config", "json");
console.log(result);
console.log(result2);

