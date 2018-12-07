#!/usr/bin/env node

var fs = require("fs");
var fileSaver = require('./filesaver.js');
var payload = fs.readFileSync("tests/test_config.json");
var ending_file_obj = JSON.parse(payload);
fileSaver.extractFile(ending_file_obj);

