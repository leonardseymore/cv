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

        if (numLoadings == 0) {
          timeoutHandle = $timeout(function(){
            $rootScope.$broadcast("loader_show");
          }, 2000);
        }

        numLoadings++;
        return config || $q.when(config);
      },
      response: function (response) {
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


