module.exports = {
    saveHandler: function(req, res) {
      if (req.method === 'POST') {
        let query = '';
        req.on('data', chunk => {
          query += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          let parsedQuery = this.getObjFromQuery(query);
          let fileParams = this.getAndRemoveFileParams(parsedQuery);
          //let filePathNew = this.newFilePath(filePathOld);
          var obj = this.flattenedObjectToObj(parsedQuery);
          this.saveObjToFile(obj, fileParams);
          this.sendResponse(res, obj, fileParams);
        });
      }
    },

    getObjFromQuery: function(body) {
      let querystring = require('querystring');
      let parsedQuery = querystring.parse(body);
      console.log("parsed body: ");
      console.log(parsedQuery);
      return parsedQuery;
    },
    
    getAndRemoveFileParams: function(parsedQuery) {
      let fileDir = parsedQuery["file_dir"];
      delete parsedQuery["file_dir"];
      let filePrefix = parsedQuery["file_prefix"];
      delete parsedQuery["file_prefix"];
      let fileExt = parsedQuery["file_ext"];
      delete parsedQuery["file_ext"];
      return [fileDir, filePrefix, fileExt];
    },
    
    newFilePath: function(filePathOld) {
      console.log("Old file path is: "+filePathOld);
      let filePathNew = filePathOld+"_new";
      console.log("New file path is: "+filePathNew);
      return filePathNew;
    },
    
    flattenedObjectToObj: function(parsedQuery) {
      let settingGroupsMap = {};
      for(var key in parsedQuery){
        console.log("key: "+key+" value: "+parsedQuery[key]);
        // [Type, SettingGroup, Setting, Value]
        var arr = key.split(".");
        let type = arr[0];
        let settingGroupName = arr[1];
        let settingName = arr[2];
        let settingFile = arr[3];
        let value = parsedQuery[key];
        if(!settingGroupsMap.hasOwnProperty(settingGroupName)){
          settingGroupsMap[settingGroupName] = {};
        }
        if(!settingGroupsMap[settingGroupName].hasOwnProperty(settingName)){
          settingGroupsMap[settingGroupName][settingName] = {};
        }
        if(!settingGroupsMap[settingGroupName][settingName].hasOwnProperty(settingFile)){
          settingGroupsMap[settingGroupName][settingName][settingFile] = {};
        }
        value = this.typedValue(type, value);
        settingGroupsMap[settingGroupName][settingName][settingFile] = value;
      }
      console.log("Obj: "+ JSON.stringify(settingGroupsMap));
      return settingGroupsMap;
    },
    
    typedValue: function(type, value) {
      if(type==="boolean"){
        return value==="true";
      } else if (type==="number"){
        return Number(value);
      }
      return value;
    },
    
    saveObjToFile: function(obj, fileParams) {
      var filesaver = require('../file_ops/filesaver/filesaver.js');
      filesaver.extractFile(obj, fileParams[0], fileParams[1], fileParams[2]);
    },
    
    sendResponse: function(res, obj, fileParams) {
      let content = "Saved to: " + fileParams[0] + "/" + fileParams[1] + "*" + "." + fileParams[2] + " content:<br/>" + JSON.stringify(obj) + '<script>setTimeout(function() {window.location.href = "http://127.0.0.1:8088/edit?dir=config&prefix=config&ext=json";}, 3000);</script>;';
      res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'keep-alive', 'Content-length': content.length});
      res.end(content);
    }

}
