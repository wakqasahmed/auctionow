'use strict';

// Create the 'auction dialog' controller
angular.module('auction').controller('AuctionDialogController', ['$scope', '$rootScope', 'Authentication', 'toastr', '$modalInstance', 'selectedItem', 
  function($scope, $rootScope, Authentication, toastr, $modalInstance, selectedItem) {

    $scope.selectedItem = selectedItem; // To show in modal
    $rootScope.currentAuctionItem = $rootScope.currentAuctionItem || {};

    $scope.startAuction = function (isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'auctionForm');
        return false;
      }

      $modalInstance.close();

      if(Object.keys($rootScope.currentAuctionItem).length === 0) {
        $rootScope.currentAuctionItem = selectedItem;
        $rootScope.currentAuctionItem.minBidAmount = $scope.minBidAmount;
        $rootScope.currentAuctionItem.quantity = $scope.quantity;
        $rootScope.currentAuctionItem.sellerName = Authentication.user.username;        
        $rootScope.currentAuctionItem.winningBidUsername = Authentication.user.username;
        $rootScope.currentAuctionItem.winningBidAmount = $scope.minBidAmount;
        $rootScope.currentAuctionItem.auctionStartTime = Date.now();
        //$rootScope.currentAuctionItem.auctionTimeLeft = 90;
        //$rootScope.currentAuctionItem.countdownVal = 90;

        toastr.success("Your item is in Auction Block for Bidding","Voila!");

        $rootScope.sendMessage(); 
      }
      else if($rootScope.currentAuctionItem.id === $scope.id) {
        toastr.error("Seems like your item is already in Auction Block","Oops..");
      }
      else {
        toastr.error("Not possible right now.<br> Auction Block is having another item at Sale.<br> Please try again when Auction Block is empty",
          "Oops..",
        {
          allowHtml: true
        });
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

/*
    $scope.startTimer = function (sectionId, timeLeft = 90) {
        $rootScope.currentAuctionItem.auctionTimeLeft = timeLeft;
        document.getElementById(sectionId).getElementsByTagName('timer')[0].start();
    };                       
*/
  }]);

// Create the 'auction' controller
angular.module('auction').controller('AuctionController', ['$scope', '$rootScope', '$location', '$timeout', 'toastr', 'Authentication', 'Socket',  
  function($scope, $rootScope, $location, $timeout, toastr, Authentication, Socket) {
    // Create a messages array
    $scope.messages = [];
    $rootScope.currentAuctionItem = $rootScope.currentAuctionItem || {};
    //$rootScope.currentAuctionItem.countdownVal = 90;
    //$rootScope.currentAuctionItem.auctionTimeLeft = 0;    

/*
    $scope.addCDSeconds = function (sectionId, extraTime) {
      $timeout(function() {
        document.getElementById(sectionId).getElementsByTagName('timer')[0].addCDSeconds(extraTime);
      });     
    };
*/

    $scope.endAuction = function () {
      //TODO: Update inventory of buyer and seller
      //TODO: Update balance of buyer and seller
      toastr.info('Winning Details:<br> Item: ' + $rootScope.currentAuctionItem.itemName + '<br> Winner: ' + $rootScope.currentAuctionItem.winningBidUsername + '<br> Winning Bid: ' + $rootScope.currentAuctionItem.winningBidAmount,
        '1.. 2.. 3.. Sold', {
        allowHtml: true
      });
      $rootScope.currentAuctionItem = null;
      //document.getElementById('timeLeft').getElementsByTagName('timer')[0].countdown = 90;      
      //$scope.callbackTimer.status='COMPLETE!!';
      $scope.$broadcast('timer-reset');
    };

    $scope.placeBid = function (isValid) {

      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'bidForm');
        return false;
      }

      if($scope.newBidAmount > $rootScope.currentAuctionItem.winningBidAmount){

        $rootScope.currentAuctionItem.winningBidUsername = Authentication.user.username;
        $rootScope.currentAuctionItem.winningBidAmount = $scope.newBidAmount; 

        $rootScope.sendMessage();
      }

      toastr.success('Your bid is winning, keep your fingers crossed OR bid again','Wohoo!');
    };

/*
    $scope.stopTimer = function(sectionId) {
      document.getElementById(sectionId).getElementsByTagName('timer')[0].stop();      
    };

    $scope.resumeTimer = function(sectionId) {
      document.getElementById(sectionId).getElementsByTagName('timer')[0].resume();      
    };
*/

    $scope.startTimer = function () {
        console.log("(Re)Start timer timeleft says: " + $rootScope.currentAuctionItem.auctionTimeLeft);
        //document.getElementById(sectionId).getElementsByTagName('timer')[0].clear();
/*
        if($rootScope.currentAuctionItem.auctionTimeLeft < 10) {
          //var latencyTime = 2;
          console.log('Time Left is less than 10 sec');
          var extraTime = 10 - timeLeft;// + latencyTime;
          //$rootScope.currentAuctionItem.auctionTimeLeft += extraTime;
          $scope.addCDSeconds('timeLeft', extraTime);   
          console.log('adding ' + extraTime + ' seconds');            
        }
*/
        console.log("resetting timer");
        $rootScope.currentAuctionItem.countdownVal = $rootScope.currentAuctionItem.auctionTimeLeft;
        console.log($rootScope.currentAuctionItem.countdownVal);



        $rootScope.$apply();

//if($rootScope.currentAuctionItem.auctionTimeLeft <= 10) {
        $scope.$broadcast('timer-reset');
        console.log($rootScope.currentAuctionItem.auctionTimeLeft);
//}

                console.log("starting timer");
        $scope.$broadcast('timer-start');
        //document.getElementById('timeLeft').getElementsByTagName('timer')[0].start();
    };
/*
    $scope.$on('timer-tick', function (event, args) {
      $rootScope.currentAuctionItem.auctionTimeLeft = args.millis/1000;  
    });
*/

    // If user is not signed in then redirect back home
    if (!Authentication.user) {
      $location.path('/authentication/signin');
    }

    // Make sure the Socket is connected
    if (!Socket.socket) {
      Socket.connect();
    }

    // Add an event listener to the 'auctionMessage' event
    Socket.on('auctionMessage', function(message) {
      $rootScope.currentAuctionItem = message.currentAuctionItem;

      $timeout(function() {
        if($rootScope.currentAuctionItem !== null && $rootScope.currentAuctionItem !== undefined){
          toastr.info('There is a new Winning Bid','Attn!');
          //$scope.startTimer('timeLeft', $rootScope.currentAuctionItem.auctionTimeLeft);
          console.log($rootScope.currentAuctionItem);
          console.log("calling start timer");          
          $scope.startTimer();                    
        }
      }); 

      //$scope.messages.unshift(message);
    });

    // Create a controller method for sending messages
    $rootScope.sendMessage = function() {
      // Create a new message object
      var message = {
        text: this.messageText,
        currentAuctionItem: $rootScope.currentAuctionItem
      };

      // Emit a 'auctionMessage' message event
      Socket.emit('auctionMessage', message);

      // Clear the message text
      this.messageText = '';
    };

    // Remove the event listener when the controller instance is destroyed
    $scope.$on('$destroy', function() {
      Socket.removeListener('auctionMessage');
    });

    // Get the current connected clients
    Socket.on('currentClients', function(count) {
      $scope.currentClients = count;
    });

  }
]);