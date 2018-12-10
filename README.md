# hackathon2018

Use the new make

Run make help

Command syntax is changed

now is http://127.0.0.1:8088/edit?dir=config&prefix=config&ext=json

Boolean values are converted into checkboxes in the webpage. When the form is posted back to the server, they become strings, "true" or "false"

* to run docker for dev:
```
./docker/docker --create --shell
```

* to run node.js file inside docker dev env:
```
node z.js
```

### Config Explanation:

* The config setting is limited to 2 layers of json object as: setting group and setting attribute, refer to config folder for example
* Multiple config files are for supported production setting at different level, which is controlled by symlink

### Current Modules:

* route.edit:
  * server handler to handler edit request
  * requests 3 params: [file dir, file prefix, file ext]
  * conducts the call to file_ops.filepicker
  * make the ui response to generate the table for file_ops.filepicker's return object

* file_ops.filepicker:
  * picks all files meet requirement, and reconstruct the config files to reflect and group the config setting at node / file level 
  * requires 3 params: [file dir, file prefix, file_ext] to pick up all files match the regex
  * merges the config files in config folder to be as in tests folder config structure
  * merges the config files ( one file for each node ) to be one json object, ending dimension for the file / node level
  * return the merged config json object

* route.save:
  * server handler to save the modification to origin config files
  * picks up the required 3 params [file dir, file prefix, file ext] for the file_ops.filesaver to support the saving path
  * handles the post submit request with query form
  * converts the query form back to the json object with setting group, setting name, file / node level structure
  * conducts the call to file_ops.filesaver
  * return the response to acknoledge the client for the finished changes

* file_ops.filesaver:
  * saves the modification result back to origin loading source
  * requires 3 params [file dir, file prefix, file ext] to identify the saving path
  * convert the setting group, setting name, file / node level obj to file / node level, setting group, setting name obj
  * save each sub obj for the file / node level to the file_dir/file_prefix.file.file_ext (file_dir/file_prefix.file_ext => global level)
  
### Future work:

* Better Modification Identification:
  * Modification is not highlighted
  * User may save the changes unintentionally
  * Do not support adding un-imported fileds from the json config level
  * Do not support deleting fileds from config level
  * Proposal 1 (preferred): 
    * Make the current edit page to view page only
    * Make a new edit page,
    * New edit page support adding, deleting, identify json type for items
    * New edit page support explicit modification items, instead of based on all existing items.
    * Time consuming
  * Proposal 2 (may be easier):
    * Adding color notification on existing edit page
    
* Better Version Control: 
  * Modification is made at the source config files
  * Mutliple users may make the config changes at the same time
  * Pull Request is needed
  * Proposal:
    * Summit the modification with singing off tag
    * Auto generate the git branch for the singing off tag
    * Submit config review to assignee's communication channel
    
* CI/CD:
  * Dependent on BVC
  * Prodution risk
