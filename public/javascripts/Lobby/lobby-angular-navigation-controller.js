/**
 * Controller for the navigation panel within the lobby.
 * Front-end javascript code inside public folder.
 *
 * @module javascripts/lobby/lobby-angular-navigation-controller
 */
angular.module('lobbyApp').controller ('navigationCtrl', function($scope, $window, socket) {
	$scope.socket = socket;
	$scope.isOpen = false;
	$scope.hasUpdates = false;
	$scope.isScrolling = false;
	$scope.questionCount = 1;
    $scope.pageElements = [];
	
	$scope.selectedMessage = 0;
	$scope.messageLogLength = 0;
	$scope.messageLog = {};
    
    /*
     *   Listeners for navigation client.
     */
	 
    //Listen for login response from server before initialising everything else.
    socket.on ( 'login', function (data) {
		
        //Ensure the user logged in is a student, otherwise do not initialise all these socket listeners.
        if (data.userType == 'student') {
			//Show the grades from the tutor for the answers provided by each group.
			socket.on ('grade question', function (data) {
				for ( var i = 0; i < $scope.pageElements.length; i++)
				{
					if ( $scope.pageElements[i].id == data.questionUuid )
					{
						$scope.pageElements[i].updates = true;
						$scope.hasUpdates = true;
						
						addMessageLog ({
							'id' : data.questionUuid,
							'message' : $scope.pageElements[i].label + ' has been graded!'
						});
						break;
					}
				}
			});
			
			//Receives questions composed and sent by tutor
			socket.on ('add question', function (data) {
				$scope.pageElements.push ({
					'id' : data.question.uuid,
					'label' : 'Question ' + $scope.questionCount,
					'link' : '#question-' + data.question.uuid,
					'updates' : true,
					'selected' : false
				});
				$('#question-' + data.question.uuid).addClass ( "selectable-element" );
				$scope.questionCount++;
				
				for ( var i = 0; i < $scope.pageElements.length; i++)
				{
					if ( $scope.pageElements[i].id == data.question.uuid )
					{
						$scope.pageElements[i].updates = true;
						$scope.hasUpdates = true;
						
						addMessageLog ({
							'id' : data.question.uuid,
							'message' : 'Received a new question: ' + $scope.pageElements[i].label + "!"
						});
						break;
					}
				}
			});
			
			socket.on ('update answer', function (data) {
				//Ensure that notifications are only given when the updates come from other students.
				if ( socket.socketId() != data.socketId )
				{
					for ( var i = 0; i < $scope.pageElements.length; i++)
					{
						if ( $scope.pageElements[i].id == data.questionUuid )
						{
							$scope.pageElements[i].updates = true;
							$scope.hasUpdates = true;
							
							addMessageLog ({
								'id' : data.questionUuid,
								'message' : $scope.pageElements[i].label + ' has been updated!'
							});
							break;
						}
					}
				}
			});
        }
		else if ( data.userType == 'tutor' )
		{
			socket.on ('submit answer', function (data) {
				for ( var i = 0; i < $scope.pageElements.length; i++)
				{
					if ( $scope.pageElements[i].id == data.uuid )
					{
						$scope.pageElements[i].updates = true;
						$scope.hasUpdates = true;
						
						addMessageLog({
							'id' : data.uuid,
							'message' : 'Group ' + data.answer.groupName + ' has answered ' + $scope.pageElements[i].label + '!'
						});
						break;
					}
				}
			});
			
			//Receives questions composed and sent by tutor
			socket.on ('log question', function (data) {
				$scope.pageElements.splice (1, 0, {
					'id' : data.question.uuid,
					'label' : 'Question ' + $scope.questionCount,
					'link' : '#question-' + data.question.uuid,
					'updates' : false,
					'selected' : false
				});
				$('#question-' + data.question.uuid).addClass ( "selectable-element" );
				$scope.questionCount++;
			});
			
			$scope.pageElements.push ({
				'id' : 'composer',
				'label' : 'Question Composer',
				'link' : '#question-composer',
				'updates' : false,
				'selected' : false
			});
			$('#question-composer').addClass ( "selectable-element" );
		}
		
		$scope.pageElements.push({
			'id' : 'chat',
			'label' : 'Chat Log',
			'link' : '#chat-container',
			'updates' : false,
			'selected' : false
		});
		$('#chat-container').addClass ( "selectable-element" );
		
		socket.on ('new message', function (data) {
			for ( var i = 0; i < $scope.pageElements.length; i++)
			{
				if ( $scope.pageElements[i].id == 'chat' )
				{
					$scope.pageElements[i].updates = true;
					$scope.hasUpdates = true;
					
					addMessageLog({
						'id' : 'chat',
						'message' : 'A new message from ' + data.username + ' in ' + data.group + '!'
					});
					break;
				}
			}
		});
    });

    /*
     *  Scope functions used by angular in the DOM.
     */
	$scope.scrollToElement = function ( index )
	{
		if ( $scope.pageElements[index].updates )
		{
			$scope.pageElements[index].updates = false;
			
			$scope.messageLog[$scope.pageElements[index].id] = null;
			updateMessageLogLength();
			
			if ( $scope.messageLogLength > 0 )
			{
				for ( var key in $scope.messageLog )
				{
					if ( $scope.messageLog[key] != null )
					{
						$scope.selectedMessage = key;
					}
				}
			}
			else
			{
				$scope.hasUpdates = false;
			}
		}
		if (!$scope.isScrolling)
		{
			$scope.isScrolling = true;

			$('html, body').animate ({
				scrollTop : $($scope.pageElements[index].link).offset().top - 100
			}, 500);
			
			//De-select all the other options.
			for ( var i = 0; i < $scope.pageElements.length; i++ )
			{
				$($scope.pageElements[i].link).removeClass ( "selected-element" );
				$scope.pageElements[i].selected = false;
			}
			$($scope.pageElements[index].link).addClass ( "selected-element" );
			$scope.pageElements[index].selected = true;
			
			setTimeout ( function () {
				$scope.isScrolling = false;
			}, 500);
		}
	};
	
	$scope.toggleTab = function ()
	{
		$scope.isOpen = !$scope.isOpen;
		if (!$scope.isOpen)
		{
			//De-select all the other options.
			for ( var i = 0; i < $scope.pageElements.length; i++ )
			{
				$($scope.pageElements[i].link).removeClass ( "selected-element" );
				$scope.pageElements[i].selected = false;
			}
		}
	};
	
	$scope.selectElementMessage = function ( index )
	{
		var selectedElement = $scope.pageElements[index];
		
		if ( selectedElement.updates )
			$scope.selectedMessage = selectedElement.id;
	};
	
	var updateMessageLogLength = function ()
	{
		var newLength = 0;
		for ( var key in $scope.messageLog )
		{
			if ( $scope.messageLog[key] !== null )
			{
				newLength++;
			}
		}
		
		$scope.messageLogLength = newLength;
	};
	
	var addMessageLog = function ( data )
	{
		$scope.messageLog[data.id] = data;
		$scope.selectedMessage = data.id;
		updateMessageLogLength();
	};
});