#!/usr/bin/env node

var fs = require("fs");
var fileMerger = require('./filemerger.js');
var payload = fs.readFileSync("delta.json");
var delta_obj = JSON.parse(payload);
fileMerger.mergeJsonToFiles(delta_obj, "./", "base", "json");

