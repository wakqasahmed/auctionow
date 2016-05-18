'use strict';

// const ntpsync = require('ntpsync');

// Create the auction configuration
module.exports = function(io, socket) {

  // When client connects
  io.on('connection', function() {
    io.emit('currentClients', socket.server.engine.clientsCount);
  });

  // Emit the status event when a new socket client is connected
  io.emit('auctionMessage', {
    type: 'status',
    text: 'has joined bidding',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  // Send a auction messages to all connected sockets when a message is received
  socket.on('auctionMessage', function(message) {
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;
    message.currentAuctionItem.auctionStartTime = message.currentAuctionItem.auctionStartTime || Date.now();
    message.currentAuctionItem.auctionTimeLeft = 90 - ((Date.now() - message.currentAuctionItem.auctionStartTime) / 1000);

    if(message.currentAuctionItem.auctionTimeLeft < 10){
      //var extraTime = 10 - message.currentAuctionItem.auctionTimeLeft;// + latencyTime;
      //message.currentAuctionItem.auctionTimeLeft += extraTime;
      message.currentAuctionItem.auctionTimeLeft = 10;
    }

    console.log(message.currentAuctionItem.auctionStartTime);
    console.log("Auction Time Left Across Clients: " + message.currentAuctionItem.auctionTimeLeft);

/*
    ntpsync.ntpLocalClockDeltaPromise().then((iNTPData) => {
        console.log(`(Local Time - NTP Time) Delta = ${iNTPData.minimalNTPLatencyDelta} ms`);
        console.log(`Minimal Ping Latency was ${iNTPData.minimalNTPLatency} ms`);
        console.log(`Total ${iNTPData.totalSampleCount} successful NTP Pings`);
    }).catch((err) => {
        console.log(err);
    });
*/
    // Emit the 'auctionMessage' event
    io.emit('auctionMessage', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', function() {
    io.emit('currentClients', socket.server.engine.clientsCount);
    io.emit('auctionMessage', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      username: socket.request.user.username
    });

  });


};
