//Singleton Object
var MemoManager = (function () {     
  var instance;
 
  function createObject() {
      var cacheManager = CacheManager.getInstance();
      var fileManager = FileManager.getInstance();      
      var MEMOS_KEY = "memos";
      var memoMap;
      var audioMedia;
      
      return {
          getMemos: function () {
              memoMap = cacheManager.get(MEMOS_KEY) || {};
              
              return memoMap;
          }, 
          getMemoDetails: function (memoID) {
              memoMap = cacheManager.get(MEMOS_KEY) || {};
              
              return memoMap[memoID];
          },
          saveMemo: function (memoItem) {  
              memoMap = cacheManager.get(MEMOS_KEY) || {};
              
              memoMap[memoItem.id] = memoItem;
              
              cacheManager.put(MEMOS_KEY, memoMap);
          }, 
          removeMemo: function(memoID) {
              cacheManager.get(MEMOS_KEY)[memoID];
              
              memoMap = cacheManager.get(MEMOS_KEY);
              
              if (memoMap[memoID]) {
            	  delete memoMap[memoID];
              }
              
              cacheManager.put(MEMOS_KEY, memoMap);
          },
          removeAllMemos: function() {
              cacheManager.remove(MEMOS_KEY);
          },
          recordVoice: function (recordingCallback) {
              
              var recordSuccess = function(mediaFiles) {
                  if (mediaFiles && mediaFiles[0]) {        
                      var currentFilePath = mediaFiles[0].fullPath;
                      
                      var fileCopyCallback = {};
                      
                      fileCopyCallback.copySuccess = function(newFilePath) {
                          recordingCallback.recordSuccess(newFilePath);
                      };
                      
                      fileCopyCallback.copyError = function(evt) {
                          alert("Unexpected failure of File copy due to the following error: " + evt.target.error.code);
                      };                      
                      
                      fileManager.copyFileToAppDirectory(currentFilePath, fileCopyCallback);
                  }
              };
              
              navigator.device.capture.captureAudio(recordSuccess, 
                                                    recordingCallback.recordError, 
                                                    {limit: 1});
          }, 
          playVoice: function (filePath, playCallback) {
              if (filePath) {                  
                  this.cleanUpResources();
                     
                  audioMedia = new Media(filePath, playCallback.playSuccess, playCallback.playError);
                
                  // Play audio
                  audioMedia.play();
              }            
          }, 
          getPhoto: function (capturingCallback, fromGallery) {      
        	  var source = Camera.PictureSourceType.CAMERA;
        	  
        	  if (fromGallery) {
        	      source = Camera.PictureSourceType.PHOTOLIBRARY;  
        	  }
        	  
              navigator.camera.getPicture(capturingCallback.captureSuccess, 
            		  					  capturingCallback.captureError, 
            		  					  { 
            	                           quality: 30, 
            	  						   destinationType: Camera.DestinationType.FILE_URI, 
            	  						   sourceType: source,
            	  						   correctOrientation: true 
            	  						   });              
          },           
          cleanUpResources: function() {
              if (audioMedia) {
                  audioMedia.stop();
                  audioMedia.release();
                  audioMedia = null;
              } 
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