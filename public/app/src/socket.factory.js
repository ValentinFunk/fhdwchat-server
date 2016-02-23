angular.module('chatApp')

// Encapsulate in DI (via http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/?redirect_from_locale=de)
.factory('socket', function ($rootScope) {
  var socket = io.connect();
  console.log(socket);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
