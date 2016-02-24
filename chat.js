var io = require('socket.io')();

var users = {};

function getUsernames( ) {
  var usernames = [];
  for (var key in users) {
    usernames.push(users[key]);
  }
  return usernames;
}

io.on('connection', function(socket) {
  console.log("Sombody connected");
  
  socket.emit('channelinfo', getUsernames());

  socket.on('setname', function(username) {
    users[socket.id] = username;
    io.emit('join', username);
  });

  socket.on('disconnect', function() {
    io.emit('leave', users[socket.id]);
    delete users[socket.id];
  })

  socket.on('message', function(message) {
    var username = users[socket.id];
    if (!username) {
      console.log("Benutzer hat versucht, ohne Namen eine Nachricht abzuschicken");
      return;
    }

    io.emit('message', {
      message: message,
      username: username
    });
  });
});

module.exports = function(app) {
  io.attach(app);

  console.log("Chat Server (socket.io) gestartet")
}
