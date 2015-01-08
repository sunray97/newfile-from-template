define(function (require, exports, module) {
    "use strict";
    var commandIdh = "html";
    var commandIdj ="js";
    var commandIdc ="css";
    var commandIdp = "php";
   	var CommandManager = brackets.getModule("command/CommandManager"),
        Commands = brackets.getModule("command/Commands"),
        Menus = brackets.getModule("command/Menus"),
        FileUtils = brackets.getModule("file/FileUtils"),
        FileSystem = brackets.getModule("filesystem/FileSystem"),
        ProjectManager = brackets.getModule("project/ProjectManager"),
        ProjectModel = brackets.getModule("project/ProjectModel"),
        AppInit = brackets.getModule("utils/AppInit");
    
    var template;
    function mkdir(dir)
    {
        var promise = $.Deferred();
        dir.create(function(err, stat){
            if(err) { promise.reject(err); }
            else    { promise.resolve(); }
        });
        return promise;
    }
    
    function mkdirp(path)
    {
        var dir = FileSystem.getDirectoryForPath(path);
        var promise = $.Deferred();
        
        dir.exists(function(err, exists){
            if(!exists)
            {
                var parentFolder = path.replace(/\/+\s*$/, "").split('/').slice(0, -1).join('/');
                mkdirp(parentFolder).then(function(){
                    dir.create(function(err, stat){
                        if(err) { promise.reject(err); }
                        else    { promise.resolve(); }
                    });
                })
                .fail(function(err){
                    promise.reject(err);
                });
            }
            else {
                promise.resolve();
            }
        });
        
        return promise;
    }

    function createFile(file)
    {
        var promise = $.Deferred();
        file.write(template, {}, function(err, stat){
            if(err) { promise.reject(err); }
            else    { promise.resolve(); }
        });
        return promise;
    }
    function addFileToWorkingSet(file)
    {
        return CommandManager.execute(Commands.CMD_ADD_TO_WORKINGSET_AND_OPEN, {fullPath: file.fullPath});
    }
    function createNewFile(filename)
    {
        var fullBasePath = ProjectManager.getSelectedItem().fullPath;
        var basePath = fullBasePath.substring(0,fullBasePath.lastIndexOf("."));
        var file = FileSystem.getFileForPath(basePath + "." + filename);
        var dir = FileUtils.getDirectoryPath(file.fullPath);
                mkdirp(dir)
                    .then(function()   { return createFile(file); }) 
                    .then(function()   { return addFileToWorkingSet(file); }) 
 }				
    
    
    function newhtml() {
    	template = require('text!html-template.html');
    	createNewFile('new.html');
    }
    function newjs() {
    	template = require('text!js-template.js');
    	createNewFile('new.js');
    	
    }
    function newcss() {
    	template = require('text!css-template.css');
    	createNewFile('new.css');
    	
    }
    function newphp() {
        template = require('text!php-template.php');
 		createNewFile('new.php');
    }
//command
CommandManager.register("New html", commandIdh, newhtml);
CommandManager.register("New js", commandIdj, newjs);
CommandManager.register("New css", commandIdc, newcss);
CommandManager.register("New php", commandIdp, newphp);
//Menus
var menu = Menus.addMenu("New as", "edgedocks.custom.menu" );  
 menu.addMenuItem(commandIdh,[{key: "Ctrl-Shift-h", platform: "win"},
{key: "Ctrl-Shift-h", platform: "mac"}]);
 menu.addMenuItem(commandIdj,[{key: "Ctrl-Shift-j", platform: "win"},
{key: "Ctrl-Shift-j", platform: "mac"}]);
 menu.addMenuItem(commandIdc,[{key: "Ctrl-Shift-c", platform: "win"},
{key: "Ctrl-Shift-c", platform: "mac"}]);
 menu.addMenuItem(commandIdp,[{key: "Ctrl-Shift-p", platform: "win"},
{key: "Ctrl-Shift-p", platform: "mac"}]);
});


