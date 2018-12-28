#!/usr/bin/env node

var delta_json = {
    l1: {
        l2: {
            l31: 5
        }
    }
};

var full_json = {
    l1: {
        l2: {
            l31: 1,
            l32: "abc"
        }
    },
    l11: {
        l2: {
            l3: false
        }
    }
};

var jsonMerger=require('./filemerger.js');
var new_full = jsonMerger.mergeJson(delta_json, full_json);
console.log(new_full);
