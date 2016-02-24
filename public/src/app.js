angular
.module('chatApp', ['ngMaterial', 'ngMessages'])
.run(function($rootScope, $mdSidenav) {
  $rootScope.toogleUsers = function( ){
    $mdSidenav('rooms-sidenav').toggle();
  }
})
.config(function($mdThemingProvider, $mdIconProvider){

    $mdIconProvider
        .defaultIconSet("./assets/svg/avatars.svg", 128)
        .icon("menu"       , "./assets/svg/menu.svg"        , 24)
        .icon("share"      , "./assets/svg/share.svg"       , 24)
        .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
        .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
        .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
        .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('green')
            .accentPalette('light-green');

})

.controller('NameDialogController', function($scope, $mdDialog) {
  $scope.mdDialog = $mdDialog;
})

.controller('AppController', function(socket, $scope, $mdDialog) {
  $scope.messages = [];
  $scope.users = [];

  $scope.openDialog = function() {
    return $mdDialog.show({
      controller  : "NameDialogController",
      templateUrl : 'changename.html'
    });
  }

  socket.on('join', function(username) {
    $scope.users.push(username);
    $scope.messages.push({username: "INFO", message: username + " ist dem Chat beigetreten."});
  });

  socket.on('message', function(message) {
    $scope.messages.push(message);
  })

  socket.on('channelinfo', function(users) {
    $scope.users = users;
  });

  socket.on('leave', function(username) {
    for (var key in $scope.users) {
      if ($scope.users[key] == username) {
        $scope.users.splice(key, 1);
      }
    }
    $scope.messages.push({username: "INFO", message: username + " hat den Chat verlassen."});
  });

  $scope.newMessageText = "";
  $scope.sendMessage = function(message) {
    socket.emit('message', message);
    $scope.newMessageText = "";
  }

  $scope.openDialog()
  .then(function(name) {
    socket.emit('setname', name);
  });
});
