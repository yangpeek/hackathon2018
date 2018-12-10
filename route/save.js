module.exports = {
    saveHandler: function(req, res) {
      if (req.method === 'POST') {
        let query = '';
        req.on('data', chunk => {
          query += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          let parsedQuery = this.getObjFromQuery(query);
          let filePathOld = this.getAndRemoveFilePath(parsedQuery);
          let filePathNew = this.newFilePath(filePathOld);
          var obj = this.flattenedObjectToObj(parsedQuery);
          this.saveObjToFile(obj, filePathNew);
          this.sendResponse(res, filePathNew, obj);
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
    
   getAndRemoveFilePath: function(parsedQuery) {
      let filePathOld = parsedQuery["file.file_path"];
      delete parsedQuery["file.file_path"];
      return filePathOld;
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
        let value = parsedQuery[key];
        if(!settingGroupsMap.hasOwnProperty(settingGroupName)){
          settingGroupsMap[settingGroupName] = {};
        }
        if(!settingGroupsMap[settingGroupName].hasOwnProperty(settingName)){
          settingGroupsMap[settingGroupName][settingName] = {};
        }

        value = this.typedValue(type, value);
        settingGroupsMap[settingGroupName][settingName] = value;
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
    
    saveObjToFile: function(obj, filePathNew) {
    },
    
    sendResponse: function(res, filePathNew, obj) {
      let content = "Saved to: "+filePathNew+" content:<br/>"+JSON.stringify(obj);
      res.writeHead(200, {'Content-Type': 'text/html', 'Connection': 'keep-alive', 'Content-length': content.length});
      res.end(content);
    }

}
