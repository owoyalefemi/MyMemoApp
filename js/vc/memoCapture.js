(function() {
    
    var memoManager = MemoManager.getInstance();
    
    $(document).on("pageinit", "#memoCapture", function(e) {
        e.preventDefault();
        
        $("#saveMemo").on("tap", function(e) {
            e.preventDefault();
           
            var memoItem = new MemoItem({
            							 "type": $("#mtype").val(),
            							 "title": $("#title").val() || $("#mtime").val() , 
                                         "desc": $("#desc").val() || "", 
                                         "location": $("#location").val() || "",
                                         "mtime": $("#mtime").val(),
                                         "id": $("#mid").val() || null
                                         });

            memoManager.saveMemo(memoItem);
            
            $.mobile.changePage("#memoList");
        });        
        
        $("#removeMemo").on("tap", function(e) {
            e.preventDefault();
            
    	    AppUtil.showConfirmationMessage("Are you sure you want to remove this memo?", removeCurrentMemo);
        });         
        
        $("#recordVoice").on("tap", function(e) {
            e.preventDefault();
        
            var recordingCallback = {};
            
            recordingCallback.recordSuccess = handleRecordSuccess;
            recordingCallback.recordError = handleRecordError;
            
            memoManager.recordVoice(recordingCallback);
         }); 
        
        $("#playVoice").on("tap", function(e) {
            e.preventDefault();
        
            var playCallback = {};
            
            playCallback.playSuccess = handlePlaySuccess;
            playCallback.playError = handlePlayError;
            
            memoManager.playVoice($("#location").val(), playCallback);
        });   
        
    	$("#getPhoto").on("tap", function(e) {
    		e.preventDefault();
    		
    		$("#photoTypeSelection").popup("open");
    	});        
        
        $("#photoFromGallery").on("tap", function(e) {
            e.preventDefault();
    		$("#photoTypeSelection").popup("close");
    		
            getPhoto(true);
         });    
        
        $("#photoFromCamera").on("tap", function(e) {
            e.preventDefault();
    		$("#photoTypeSelection").popup("close");
    		
            getPhoto(false);
         });     
    });
    
    $(document).on("pageshow", "#memoCapture", function(e) {
        e.preventDefault();
        
        var memoID = ($.mobile.pageData && $.mobile.pageData.memoID) ? $.mobile.pageData.memoID : null;
        var memoType = ($.mobile.pageData && $.mobile.pageData.newMemo) ? $.mobile.pageData.newMemo : null;        
        var memoItem = null;
        var isNew = true;
        
        if (memoID) {
        	
        	//Update Memo
            memoItem = memoManager.getMemoDetails(memoID);            
            isNew = false;
        } else {
        	
        	//Create a new Memo
        	memoItem = new MemoItem({"type": memoType});    	
        }
        
        populateRecordingFields(memoItem, isNew);
    });
    
    $(document).on("pagebeforehide", "#memoCapture", function(e) {
        memoManager.cleanUpResources();
    });
    
    function removeCurrentMemo() {
        memoManager.removeMemo($("#mid").val());
        $.mobile.changePage("#memoList");    	
    }
    
    function populateRecordingFields(memoItem, isNew) {
        $("#mid").val(memoItem.id);
        $("#mtype").val(memoItem.type);
        $("#title").val(memoItem.title);
        $("#desc").val(memoItem.desc);
        $("#location").val(memoItem.location);
        $("#mtime").val(memoItem.mtime);
        
        $("#recordVoice").closest('.ui-btn').hide();
        $("#getPhoto").closest('.ui-btn').hide();            
        $("#playVoice").closest('.ui-btn').hide();        
        $("#removeMemo").closest('.ui-btn').hide(); 
        $("#imageView").hide();    
        $("#imageView").attr("src", "");   
        
        if (! isNew) {
            $("#removeMemo").closest('.ui-btn').show(); 
        }
        
        if (memoItem.type == "voice") {
            $("#recordVoice").closest('.ui-btn').show();  
            
	        if (memoItem.location && memoItem.location.length > 0) {
	            $("#playVoice").closest('.ui-btn').show();
	        }        	
        } else if (memoItem.type == "photo") {
            $("#getPhoto").closest('.ui-btn').show();
        	
	        if (memoItem.location && memoItem.location.length > 0) {
	            $("#imageView").show();  
	            $("#imageView").attr("src", memoItem.location); 
	        }      	
        }
    }
    
    function getPhoto(fromGallery) {
        var capturingCallback = {};
        
        capturingCallback.captureSuccess = handleCaptureSuccess;
        capturingCallback.captureError = handleCaptureError;
        
        memoManager.getPhoto(capturingCallback, fromGallery);    	
    }
    
    function handleRecordSuccess(newFilePath) {            
        var currentFilePath = newFilePath;
        
        $("#location").val(currentFilePath);    
        $("#playVoice").closest('.ui-btn').show();  
    }
        
    function handleRecordError(error) {
        displayMediaError(error);
    }  
    
    function handlePlaySuccess() {
        console.log("Voice file is played successfully ...");
    }
    
    function handlePlayError(error) {
        displayMediaError(error);
    }        
    
    function handleCaptureSuccess(newFilePath) {            
        var currentFilePath = newFilePath;
        
        $("#imageView").show();  
        $("#imageView").attr("src", currentFilePath);         
        $("#location").val(currentFilePath);  
    }    
    
    function handleCaptureError(message) {
    	console.log("Camera capture error");
    }      
        
    function displayMediaError(error) {
        if (error.code == MediaError.MEDIA_ERR_ABORTED) {
        	console.log("Media aborted error");
        } else if (error.code == MediaError.MEDIA_ERR_NETWORK) {
        	console.log("Network error");
        } else if (error.code == MediaError.MEDIA_ERR_DECODE) {
        	console.log("Decode error");
        } else if (error.code ==  MediaError.MEDIA_ERR_NONE_SUPPORTED) {
        	console.log("Media is not supported error");
        } else {
            console.log("General Error: code = " + error.code);
        }        
    }
})();
