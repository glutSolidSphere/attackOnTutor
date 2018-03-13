/**
 * Controller for the tutor battle scene functionalities within the lobby.
 * Front-end javascript code inside public folder.
 *
 * @module javascripts/lobby/lobby-angular-tutor-controller
 */
angular.module('lobbyApp').controller ('studentBattleCtrl', function($scope, $window, socket) {
	$scope.socket = socket;
	$scope.group = "";
	
	$scope.showBattleWindow = false;
	$scope.showSplash = false;
	$scope.showEndSplash = false;
	
	$scope.currentTime = 30;
	$scope.battleDuration = 30;
	
	$scope.tutorAvatar = {};
	$scope.health = 100;
    $scope.maxHealth = 100;
	$scope.totalDeath = 0;
	
	$scope.currentRuneData = {};
	$scope.groups = [];
	$scope.runes = [];
	$scope.effects = {};
	
	$scope.rankedGroups = [];
	
	$scope.loot = [];
	
	$scope.studentAvatar = {};
	$scope.maxStudentAvatarWidth = 15;
	$scope.minStudentAvatarWidth = 10;
	
    /*
     *   Listeners for student client.
     */

    //Listen for login response from server before initialising everything else.
    socket.on ('login', function (data) {
		$scope.tutorAvatar = {
			'userAvatar' : data.tutorAvatar,
			'avatarWidth' : 1,
			'avatarHeight' : 2
		};
		
        //Ensure the user logged in is a student, otherwise do not initialise all these socket listeners.
        if (data.userType == 'student') {
            socket.on ('show splash', function (data) {
                $scope.showSplash = true;
				$scope.showBattleWindow = true;
				
				$scope.health = 100;
				$scope.maxHealth = 100;
				$scope.totalDeath = 0;
				
				$scope.currentRuneData = {};
				$scope.groups = [];
				$scope.runes = [];
				$scope.loot = [];
				$scope.effects = {};
				
				var users = data.userList;
				var groups = data.groupList;
				
				//Get this student's group for the overdrive.
				var groupMembers = users[groups[0]];
				for ( var i = 0; i < groupMembers.length; i++ )
				{
					if ( groupMembers[i].userId == $window.userId )
					{
						$scope.group = groupMembers[i].group;
						break;
					}
				};
				
				//Get the overdrive duration for the student.
				$scope.currentTime = $scope.battleDuration = data.rewards[$scope.group].overdriveDuration;
				
				//Get an array of the keys for the groups in order of their rankings.
				var groupKeysToRank = {};
				for ( var group in data.rewards )
				{
					groupKeysToRank[group] = data.rewards[group].params.rank;
				}
				var sortedGroupKeysByRank = Object.keys ( groupKeysToRank ). sort ( function ( a, b ) {
					return groupKeysToRank[a] - groupKeysToRank[b];
				});
				
				$scope.setUpGroups (sortedGroupKeysByRank, users);
				
				var groupIndex = 0;
				$scope.showGroupRankings ( groupIndex, sortedGroupKeysByRank, data );
            });
			
			socket.on ('start battle', function ( data ) {
				if ( $scope.showSplash )
				{
					socket.emit ( 'student get rune', { 
					});
					
					$scope.showSplash = false;
				}
			});
			
			//Get the runes from the server.
			socket.on ('student set rune', function (data) {
				$scope.currentRuneData = {
					'runeId' : data.runeId,
					'id' : data.runeData.id
				};
				
				$scope.runes.push ({
					'completed' : false,
					'symbols' : data.runeData.symbols,
					'width' : data.runeData.width,
					'height' : data.runeData.height,
					'id' : data.runeData.id, //Identifier for the symbol set of the rune.
					'name' : data.runeData.name,
					'runeId' : data.runeId, //Identifier for the rune.
					'positionBottom' : 50,
					'positionRight' : 50
				});
            });
			
			//Get the tutor attack runes from the server.
			socket.on ('student set rune attack', function (data) {
				$scope.runes.push ({
					'completed' : false,
					'symbols' : data.runeData.symbols,
					'width' : data.runeData.width,
					'height' : data.runeData.height,
					'id' : data.runeData.id, //Identifier for the symbol set of the rune.
					'name' : data.runeData.name,
					'runeId' : data.runeId, //Identifier for the rune.
					'positionBottom' : 50 + (Math.random() * (20 + 20) - 20),
					'positionRight' : 50 + (Math.random() * (20 + 20) - 20)
				});
            });
			
			socket.on ( 'show attack effect', function (data) {
				var key = Date.now();
				var positionLeft = 0;
				var positionTop = 0;
				var marginLeft = -data.effect.width;
				var marginTop = -data.effect.height * 0.5;
				if (data.targetGroup !== "")
				{
					var groupId = '#' + $.escapeSelector ('group-' + data.targetGroup);
					var groupElement = $(groupId)[0].getBoundingClientRect();
					positionTop = groupElement.top;
					marginLeft = 0;
				}
				else if (data.sourceId !== "")
				{
					var studentId = "#player-avatar";
					if ( data.sourceId != $scope.studentAvatar.userId )
					{
						var sourceMember = $scope.getMemberFromUserId ( data.sourceId, data.sourceGroup );
						var studentId = '#' + $.escapeSelector ('student-' + sourceMember.userId);
					}
					console.log ( $(studentId)[0].getBoundingClientRect());
					var studentElement = $(studentId)[0].getBoundingClientRect();
					positionTop = studentElement.top + (studentElement.height * 0.5);
					positionLeft = studentElement.left + (studentElement.width * 0.5);
				}
				
				$scope.effects[key] = ({
					'image' : data.effect.image,
					'width' : data.effect.width,
					'height' : data.effect.height,
					'marginLeft' : marginLeft,
					'marginTop' : marginTop,
					'positionTop' : positionTop,
					'positionLeft' : positionLeft
				});
				
				setTimeout ( function()
				{
					$scope.$apply ( function () {
						delete $scope.effects[key];
					});
				}, data.effect.duration);
			});
			
			//Update the battle health status.
			socket.on ('update battle health', function (data) {
				$scope.health = data.currentHealth;
				$scope.totalDeath = data.deaths;
            });
			
			socket.on ( 'timer tick', function (data) {
				$scope.currentTime-=1000;
			});
			
			socket.on ( 'store loot', function ( data ) {
				$scope.loot = data.loot;
			});
			
			socket.on ( 'show loot screen', function (data) {
				$scope.showEndSplash = true;
			});
			
			socket.on ( 'wait for groups', function (data) {
				//TODO: Show a waiting splash.
				console.log ("waiting");
			});
        }
    });

    /*
     *  Scope functions used by angular in the DOM.
     */
	 
	 /**
     * Recursive function to show all the group rankings.
	 *
     */
    $scope.showGroupRankings = function (groupIndex, sortedGroupKeysByRank, data) {
		if ( groupIndex < sortedGroupKeysByRank.length )
		{
			var group = sortedGroupKeysByRank[groupIndex];
			//Rearrange the members by rank.
			var groupMembersToRank = {};
			for ( var member in data.rewards[group].members )
			{
				groupMembersToRank[member] = data.rewards[group].members[member].rank;
			}
			var sortedMembersByRank = Object.keys ( groupMembersToRank ). sort ( function ( a, b ) {
				return groupMembersToRank[a] - groupMembersToRank[b];
			});
			//Push in members who aren't ranked as bronze members.
			for ( var i = 0; i< data.userList[group].length; i++ )
			{
				if ( sortedMembersByRank.indexOf ( data.userList[group][i].userId ) == -1 && data.userList[group][i].userType == "student" )
				{
					sortedMembersByRank.push (data.userList[group][i].userId);
					data.rewards[group].members[data.userList[group][i].userId] = 
					{
						'params' : {
							'userAvatar' : data.userList[group][i].userAvatar,
							'username' : data.userList[group][i].username,
							'rank' : 3,
							'rewards' : 0
						}
					};
				}
			}
			
			$scope.rankedGroups.push ({
				'groupName' : group,
				'ranking' : data.rewards[group].ranking,
				'members' : []
			});
			
			var studentIndex = 0;
			var memberInterval = setInterval ( function () {
				var userId = sortedMembersByRank[studentIndex];
				if ( studentIndex >= sortedMembersByRank.length )
				{
					//All the students are shown.
					clearInterval ( memberInterval );
					//Start the timeout to close the pop up and open up the next one.
					setTimeout ( function () {
						$scope.$apply ( function () {
							$scope.rankedGroups.splice ( 0, 1 );
							$scope.showGroupRankings ( groupIndex + 1, sortedGroupKeysByRank, data );
						});
					}, 5000 );
				}
				else
				{
					$scope.$apply ( function () {
						//Print out the group members in 0.5 second intervals.
						$scope.rankedGroups[$scope.rankedGroups.length - 1].members.push ({
							'username' : data.rewards[group].members[userId].params.username,
							'userAvatar' : data.rewards[group].members[userId].params.userAvatar,
							'rank' : data.rewards[group].members[userId].params.rank
						});
					});
					studentIndex++;
				}
			}, 500 );
		}
		else
		{
			//End of all the groups.
			socket.emit ( 'finish splash', {});
			return;
		}
	};
	 
	 /**
     * Claim the loot.
	 *
     */
    $scope.claimLoot = function () {
		$scope.showBattleWindow = false;
		$scope.showEndSplash = false;
	};
	
	 /**
     * Get a group member given the userId and userGroup.
	 *
	 * @param (String) userId
	 * @param (String) userGroup
     */
    $scope.getMemberFromUserId = function (userId, userGroup) {
		for (var i = 0; i < $scope.groups.length; i++ )
		{
			if ($scope.groups[i].groupName === userGroup)
			{
				for (var j = 0; j < $scope.groups[i].members.length; j++ )
				{
					if ($scope.groups[i].members[j].userId === userId)
					{
						return $scope.groups[i].members[j];
					}
				}
			}
		}
		return null;
	};
	
	 /**
     * Check if all the runes are completed.
     *
     */
    $scope.isAllRunesCompleted = function () {
		for ( var i = 0; i < $scope.runes.length; i++ )
		{
			if (!$scope.runes[i].completed)
			{
				return false;
			}
		}
		return true;
	};
	
	/**
     * Set up the runes and each group.
     * This is only called after the groupData (with all the parameters such as avatars and other data for each member of the group) is returned from the server.
	 *
	 * @param (Array) groupData
     */
    $scope.setUpGroups = function (groupNames, userData) {
		var tutorWidth = 25;
		var tutorHeight = tutorWidth * ($scope.tutorAvatar.avatarHeight/$scope.tutorAvatar.avatarWidth);
		$scope.tutorAvatar.avatarWidth = tutorWidth;
		$scope.tutorAvatar.avatarHeight = tutorHeight;
		
		//Split up the height of the window by the number of groups.
		var groupPositioningInterval = 80.0 / ( groupNames.length + 1);
		var studentWidth = groupNames.length >= 5 ? $scope.minStudentAvatarWidth : $scope.maxStudentAvatarWidth;
		var withinGroupInterval = 0;
		for (var i = 0; i < groupNames.length; i++ )
		{
			var groupMembers = userData[groupNames[i]];
			var parsedGroupMembers = [];
			//Make the group members occupy a maximum of 30% of screen width.
			withinGroupInterval = 30.0 / groupMembers.length;
			var studentCounter = 0;
			groupMembers.forEach ( function ( member, index ) {
				if ( member.userType == 'student' )
				{
					//Place the player's avatar in the center.
					if ( member.userId == $window.userId )
					{
						var playerWidth = 25;
						var playerHeight = playerWidth * (member.avatarHeight/member.avatarWidth);
						$scope.studentAvatar = {
							'username' : member.username,
							'userId' : member.userId,
							'userAvatar' : member.userAvatar,
							'avatarWidth' : playerWidth,
							'avatarHeight' : playerHeight
						};
					}
					else
					{
						var studentHeight = studentWidth * (member.avatarHeight/member.avatarWidth);
						parsedGroupMembers.push ({
							'username' : member.username,
							'userId' : member.userId,
							'userAvatar' : member.userAvatar,
							'avatarWidth' : studentWidth,
							'avatarHeight' : studentHeight,
							'displacementBottom' : 0, //TODO: Make this displacement a bit more random to distribute the students.
							'displacementRight' :  withinGroupInterval * studentCounter
						});
						studentCounter++;
					}
				}
			});
			
			$scope.groups.push ({
				'groupName' : groupNames[i],
				'positionBottom' : 10 + groupPositioningInterval * (i + 1),
				'positionRight' : 20,
				'members' : parsedGroupMembers
			});
		}
	};
	 
	 /**
     * Complete the symbol at the given symbolIndex in the rune at given runeIndex.
     *
	 * @param (Integer) runeIndex
     * @param {Integer} symbolIndex
     */
	$scope.markSymbol = function (runeIndex, symbolIndex) {
        var rune = $scope.runes[runeIndex];
		var currentSymbol = rune.symbols[symbolIndex];

		if (currentSymbol.completed || rune.completed )
		{
			return;
		}
		
		//Make sure there is a previous symbol, otherwise just assign it to null.
		var previousSymbol = null;
		if ( symbolIndex > 0 )
		{
			previousSymbol = rune.symbols[symbolIndex - 1];
		}
		
		//If previousSymbol is null, current symbol is the first in the set.
		if (previousSymbol == null)
		{
			$scope.runes[runeIndex].symbols[symbolIndex].completed = true;
			$scope.runes[runeIndex].symbols[symbolIndex].width *= 5;
			$scope.runes[runeIndex].symbols[symbolIndex].height *= 5;
		}
		//Check if the previousSymbol has been completed.
		else
		{
			//If it is completed, complete the current symbol.
			if ( previousSymbol.completed )
			{
				$scope.runes[runeIndex].symbols[symbolIndex].completed = true;
				$scope.runes[runeIndex].symbols[symbolIndex].width *= 5;
				$scope.runes[runeIndex].symbols[symbolIndex].height *= 5;
			}
		}
		
		//If the current symbol is the last in the sequence.
		if ( symbolIndex == (rune.symbols.length - 1) && currentSymbol.completed )
		{
			$scope.runes[runeIndex].completed = true;
			//Produce the visual feedback for rune completion.
			$scope.runes[runeIndex].width *= 5;
			$scope.runes[runeIndex].height *= 5;
			
			//There is only one rune, and it is completed thus an attack can be sent.
			if ( $scope.runes.length == 1 )
			{
				//TODO: Send this to the server along with more data about the type of attack.
				socket.emit ('student rune attack', {
					'runeId' : $scope.currentRuneData.runeId,
					'id' : $scope.currentRuneData.id
				});
			}
			
			//Get a new rune from the server after a small break.
			setTimeout ( function()
			{
				//Remove the completed rune.
				$scope.runes.splice ( runeIndex, 1 );
				if ( $scope.runes.length == 0 )
				{
					socket.emit ( 'student get rune', { 
					});
				}
				$scope.$digest();
			}, 500);
		}
	};
});