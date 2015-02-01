'use strict';

angular.module('cvApp')

  .factory('httpInterceptor', function ($q, $rootScope, $timeout) {
    var numLoadings = 0;
    var timeoutHandle = null;

    return {
      request: function (config) {
        if (config.url.indexOf("inline_") == 0) {
          return config || $q.when(config);
        }

        console.log(numLoadings);
        if (numLoadings == 0) {
          console.log(config);
          timeoutHandle = $timeout(function(){
            $rootScope.$broadcast("loader_show");
          }, 1000);
        }

        numLoadings++;
        return config || $q.when(config);
      },
      response: function (response) {
        if (response.config.url.indexOf("inline_") == 0) {
          return response || $q.when(response);
        }

        if (--numLoadings == 0) {
          if (timeoutHandle) {
            $timeout.cancel(timeoutHandle);
            timeoutHandle = null;
          }
          $rootScope.$broadcast("loader_hide");
        }

        return response || $q.when(response);

      },
      responseError: function (response) {
        if (response.config.url.indexOf("inline_") == 0) {
          return $q.reject(response);
        }

        if (!(--numLoadings)) {
          if (timeoutHandle) {
            $timeout.cancel(timeoutHandle);
            timeoutHandle = null;
          }
          $rootScope.$broadcast("loader_hide");
        }

        return $q.reject(response);
      }
    };
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
  });
;


