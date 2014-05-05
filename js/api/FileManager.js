//Singleton Object
var FileManager = (function () {     
  var instance;
 
  function createObject() {
      var audioMedia;
      var BASE_DIRECTORY = "Memo";
      var FILE_BASE = "file:///";
      
      return {
          copyFileToAppDirectory: function (filePath, fileCallback) {              
              var directoryReady = function (dirEntry) { 
            	  if (filePath.indexOf(FILE_BASE) != 0) {
                      filePath = filePath.replace("file:/", FILE_BASE);
              	  }
              
                  window.resolveLocalFileSystemURL(filePath, function(file) {
                      var filename = filePath.replace(/^.*[\\\/]/, '');
                          
                      file.moveTo(dirEntry, filename);
                      
                      fileCallback.copySuccess(dirEntry.toURL() + "/" + filename);
                   }, fileCallback.copyError);  
              };              
              
              var fileSystemReady = function(fileSystem) {
                  fileSystem.root.getDirectory(BASE_DIRECTORY, {create: true}, directoryReady);                    
              };
                            
              window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemReady, fileCallback.copyError);
          }
    };
  };
 
  return {
    getInstance: function () {
      if (!instance) {
          instance = createObject();
      }
 
      return instance;
    }
  }; 
})();