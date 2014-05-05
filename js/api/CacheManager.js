//Singleton Object that uses JStorage
var CacheManager = (function () {     
  var instance;
 
  function createObject() {   
    return {
        put: function (key, value) {
            $.jStorage.set(key, value);
        },
        get: function (key) {
        	return $.jStorage.get(key);
        },
        remove: function (key) {
        	return $.jStorage.deleteKey(key);
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