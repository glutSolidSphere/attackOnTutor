/**
 * Controller for the tutor battle scene functionalities within the lobby.
 * Front-end javascript code inside public folder.
 *
 * @module javascripts/lobby/lobby-angular-tutor-controller
 */
angular.module('lobbyApp').controller ('tutorBattleCtrl', function($scope, $window, socket) {
	$scope.socket = socket;
	$scope.userId = $window.userId;
	
	$scope.showBattleWindow = false;
	$scope.showSplash = false;
	$scope.showStartSplash = false;
	$scope.showEndSplash = false;
	
	$scope.currentTime = 30;
	$scope.battleDuration = 30;
	
	$scope.tutorAvatar = {};
	$scope.health = 100;
    $scope.maxHealth = 100;
	$scope.totalDeath = 0;
	
	$scope.maxStudentAvatarWidth = 15;
	$scope.minStudentAvatarWidth = 10;
	
	$scope.groups = [];
	$scope.runes = [];
	$scope.selectedGroupIndex = -1;
	$scope.effects = {};
	
	$scope.rankIcons = {
		3 : '/images/crown-b.png',
		2 : '/images/crown-s.png',
		1 : '/images/crown-g.png'
	};
	$scope.rankedGroups = [];
	$scope.rankDisplayTime = 10000;
	
    /*
     *   Listeners for tutor client.
     */

    //Listen for login response from server before initialising everything else.
    socket.on ('login', function (data) {
		
        //Ensure the user logged in is a tutor, otherwise do not initialise all these socket listeners.
        if (data.userType == 'tutor') {
			$scope.tutorAvatar = data.userAvatar;
			$scope.tutorAvatar.currentAnim = data.userAvatar.idleAnim;
			$scope.tutorAvatar.username = data.username;
            socket.on ('show splash', function (data) {
				$scope.showBattleWindow = true;
				$scope.showStartSplash = true;
				
				$scope.health = 100;
				$scope.maxHealth = 100;
				$scope.totalDeath = 0;
				
				$scope.currentRuneData = {};
				$scope.groups = [];
				$scope.runes = [];
				$scope.effects = {};
				
				//Get the longest duration from all the groups and use that for the tutor.
				var overdriveDuration = 0;
				for ( var group in data.rewards )
				{
					if ( data.rewards[group].overdriveDuration > overdriveDuration )
					{
						overdriveDuration = data.rewards[group].overdriveDuration;
					}
				}
				$scope.currentTime = $scope.battleDuration = overdriveDuration;
				
				var users = data.userList;
				var groups = data.groupList;
				
				//Get an array of the keys for the groups in order of their rankings.
				var groupKeysToRank = {};
				for ( var group in data.rewards )
				{
					groupKeysToRank[group] = data.rewards[group].params.rank;
				}
				var sortedGroupKeysByRank = Object.keys ( groupKeysToRank ). sort ( function ( a, b ) {
					return groupKeysToRank[a] - groupKeysToRank[b];
				});
				
				var groupIndex = 0;
				
				$scope.setUpGroups (sortedGroupKeysByRank, users);
				
				setTimeout ( function () {
					$scope.$apply( function () {
						$scope.showStartSplash = false;
						
						$scope.showSplash = true;
						
						$scope.showGroupRankings ( groupIndex, sortedGroupKeysByRank, data );
					});
				}, 1000);
            });
			
			//Get the runes from the server.
			socket.on ('tutor set rune', function (data) {
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
				/*
				$scope.runes[data.index].completed = false;
                $scope.runes[data.index].symbols = data.runeData.symbols;
				$scope.runes[data.index].width = data.runeData.width;
				$scope.runes[data.index].height = data.runeData.height;
				$scope.runes[data.index].id = data.runeData.id;
				$scope.runes[data.index].name = data.runeData.name;
				$scope.runes[data.index].runeId = data.runeId;
				*/
            });
			
			socket.on ( 'show attack effect', function (data) {
				var key = Date.now();
				var positionLeft = 0;
				var positionTop = 0;
				var marginLeft = -data.effect.width * 0.5;
				var marginTop = -data.effect.height * 0.5;
				var animationType = "firedFromTutor";
				if (data.targetGroup !== "")
				{
					var groupId = '#' + $.escapeSelector ('group-' + data.targetGroup);
					var groupElement = $(groupId)[0].getBoundingClientRect();
					positionTop = groupElement.top;
				}
				else if (data.sourceId !== "")
				{
					var sourceMember = $scope.getMemberFromUserId ( data.sourceId, data.sourceGroup );
					var studentId = '#' + $.escapeSelector ('student-' + sourceMember.userId);
					var studentElement = $(studentId)[0].getBoundingClientRect();
					positionTop = studentElement.top + (studentElement.height * 0.5);
					positionLeft = studentElement.left + (studentElement.width * 0.5);
					animationType = "firedFromStudent";
				}
				
				$scope.effects[key] = ({
					'duration' : data.effect.duration * 0.001,
					'animation' : "",
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
						$scope.effects[key].animation = animationType;
					});
				}, 100);
				
				setTimeout ( function()
				{
					$scope.$apply ( function () {
						$scope.effects[key].animation = animationType + "End";
					});
				}, data.effect.duration - 250);
				
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
			
			socket.on ( 'wait for groups', function (data) {
				//TODO: Show a waiting splash.
				console.log ("waiting for " + data.groupName);
			});
			
			socket.on ( 'show loot screen', function (data) {
				$scope.showEndSplash = true;
				setTimeout ( function()
				{
					$scope.$apply (function() {
						$scope.showEndSplash = false;
						$scope.showBattleWindow = false;
					});
				}, 1000);
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
			
			//Get the number of top players for the group to display; choose 1 player if none of the players are tops, or a maximum of 4 top players if the tops are evenly spread out.
			var numberOfTops = sortedMembersByRank.length;
			numberOfTops = numberOfTops == 0 ? 1 : (numberOfTops > 4 ? 4 : numberOfTops);
			console.log ( numberOfTops );
					
			//Push in members who aren't ranked as bronze members.
			for ( var i = 0; i< data.userList[group].length; i++ )
			{
				if ( data.userList[group][i].userType == "student" )
				{
					if ( sortedMembersByRank.indexOf ( data.userList[group][i].userId ) == -1 )
					{
						sortedMembersByRank.push (data.userList[group][i].userId);
						data.rewards[group].members[data.userList[group][i].userId] = 
						{
							'params' : {
								'userAvatar' : data.userList[group][i].userAvatar,
								'username' : data.userList[group][i].username,
								'rank' : 3,
								'answersSubmitted' : 0,
								'reward' : 0
							}
						};
					}
					else
					{
						data.rewards[group].members[data.userList[group][i].userId].params.userAvatar = data.userList[group][i].userAvatar;
						data.rewards[group].members[data.userList[group][i].userId].params.username = data.userList[group][i].username;
					}
				}
			}
			
			var groupData = $scope.getGroupFromName ( group );
			var color = 0;
			var saturation = 100;
			if ( groupData !== null )
			{
				color = groupData.color;
				saturation = groupData.saturation;
			}
			$scope.rankedGroups.push ({
				'groupName' : group,
				'color' : color,
				'saturation' : saturation,
				'ranking' : data.rewards[group].ranking,
				'totalQuestions' : data.rewards[group].totalQuestions,
				'overdriveDuration' : data.rewards[group].overdriveDuration,
				'groupPerformance' : data.rewards[group].groupPerformance,
				'currentTime' : $scope.rankDisplayTime,
				'totalDisplayTime' : $scope.rankDisplayTime,
				'topMembers' : [],
				'allMembers' : []
			});
			
			//Get a complete list of all members sorted by rank.
			for ( var i = 0; i < sortedMembersByRank.length; i++ )
			{
				$scope.rankedGroups[$scope.rankedGroups.length - 1].allMembers.push ({
					'userId' : sortedMembersByRank[i],
					'username' : data.rewards[group].members[sortedMembersByRank[i]].params.username,
					'userAvatar' : data.rewards[group].members[sortedMembersByRank[i]].params.userAvatar,
					'rank' : data.rewards[group].members[sortedMembersByRank[i]].params.rank,
					'rankIcon' : $scope.rankIcons[data.rewards[group].members[sortedMembersByRank[i]].params.rank],
					'answersSubmitted' : data.rewards[group].members[sortedMembersByRank[i]].params.answersSubmitted
				});
			}
			
			var studentIndex = 0;
			var memberInterval = setInterval ( function () {
				var userId = sortedMembersByRank[studentIndex];
				if ( studentIndex >= sortedMembersByRank.length )
				{
					//All the students are shown.
					clearInterval ( memberInterval );
					//Start the timeout to close the pop up and open up the next one.
					var displayTick = setInterval ( function () {
						$scope.$apply ( function () {
							$scope.rankedGroups[$scope.rankedGroups.length - 1].currentTime -= 1000;
						});
						if ( $scope.rankedGroups[$scope.rankedGroups.length - 1].currentTime < 0 )
						{
							//Give a small grace period before changing screens.
							setTimeout ( function () {
								clearInterval ( displayTick );
								$scope.$apply ( function () {
									$scope.rankedGroups.splice ( 0, 1 );
									$scope.showGroupRankings ( groupIndex + 1, sortedGroupKeysByRank, data );
								});
							}, 500 );
						}
					}, 1000);
				}
				else
				{
					var widthToSplit = 100 / (numberOfTops+1);
					var cardSize = numberOfTops >= 3 ? 12 : 17.5;
					$scope.$apply ( function () {
						//Print out the top group members in 0.5 second intervals up to a maximum of 4, and only if the player rank is 2 and below.
						if ( ($scope.rankedGroups[$scope.rankedGroups.length - 1].topMembers.length < 4 && data.rewards[group].members[userId].params.rank <= 2) ||
							($scope.rankedGroups[$scope.rankedGroups.length - 1].topMembers.length === 0))
						{
							console.log (  data.rewards[group].members[userId].params );
							$scope.rankedGroups[$scope.rankedGroups.length - 1].topMembers.push ({
								'userId' : userId,
								'username' : data.rewards[group].members[userId].params.username,
								'userAvatar' : data.rewards[group].members[userId].params.userAvatar,
								'rank' : data.rewards[group].members[userId].params.rank,
								'rankIcon' : $scope.rankIcons[data.rewards[group].members[userId].params.rank],
								'answersSubmitted' : data.rewards[group].members[userId].params.answersSubmitted,
								'positionLeft' : widthToSplit * (studentIndex + 1),
								'size' : cardSize
							});
						}
					});
					studentIndex++;
				}
			}, 2500 );
		}
		else
		{
			//End of all the groups.
			socket.emit ( 'finish splash', {});
			//socket.emit ( 'tutor get rune', {});
					
			$scope.showSplash = false;
			return;
		}
	};
	
	/**
     * Get the group data given a group name.
	 *
     */
    $scope.getGroupFromName = function ( groupName ) {
		for ( var i = 0; i < $scope.groups.length; i++ )
		{
			if ( $scope.groups[i].groupName == groupName )
			{
				return $scope.groups[i];
			}
		}
		return null;
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
     * Select a group to send an attack to.
	 *
	 * @param (Integer) groupIndex
     */
    $scope.selectGroup = function (groupIndex) {
		$scope.selectedGroupIndex = groupIndex;
		if ($scope.runes.length == 0)
		{
			socket.emit ( 'tutor get rune', {});
		}
	};
	 
	 /**
     * Set up the runes and each group.
     * This is only called after the groupData (with all the parameters such as avatars and other data for each member of the group) is returned from the server.
	 *
	 * @param (Array) groupData
     */
    $scope.setUpGroups = function (groupNames, userData) {
		var tutorWidth = 25;
		var tutorHeight = tutorWidth * ($scope.tutorAvatar.height/$scope.tutorAvatar.width);
		$scope.tutorAvatar.width = tutorWidth;
		$scope.tutorAvatar.height = tutorHeight;
		
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
			groupMembers.forEach ( function ( member, index ) {
				if ( member.userType == 'student' )
				{
					console.log (member);
					var studentHeight = studentWidth * (member.userAvatar.height/member.userAvatar.width);
					member.userAvatar.width = studentWidth + 3;
					member.userAvatar.height = studentHeight + 3;
					parsedGroupMembers.push ({
						'username' : member.username,
						'userId' : member.userId,
						'userAvatar' : member.userAvatar,
						'currentAnim' : member.userAvatar.idleAnim,
						'displacementBottom' : (Math.random() * (3 - (-3)) + (-3)), //TODO: Make this displacement a bit more random to distribute the students.
						'displacementRight' :  withinGroupInterval - (Math.random() * 2)
					});
				}
			});
			
			$scope.groups.push ({
				'groupName' : groupNames[i],
				'color' : (Math.random() * 360), //A number between 0 and 360 because CSS filters with hue-rotate is used.
				'saturation' : (Math.random() * (100 - 25) + 25),
				'positionBottom' : 10 + groupPositioningInterval * (i + 1),
				'positionRight' : 10,
				'members' : parsedGroupMembers
			});
		}
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
		}
		//Check if the previousSymbol has been completed.
		else
		{
			//If it is completed, complete the current symbol.
			if ( previousSymbol.completed )
			{
				$scope.runes[runeIndex].symbols[symbolIndex].completed = true;
			}
		}
		
		//If the current symbol is the last in the sequence.
		if ( symbolIndex == (rune.symbols.length - 1) && currentSymbol.completed )
		{
			$scope.runes[runeIndex].completed = true;
			
			var targetGroup = $scope.groups[$scope.selectedGroupIndex].groupName;
			//TODO: Send this to the server along with more data about the type of attack.
			socket.emit ('tutor rune attack', {
				'targetGroup' : targetGroup,
				'runeId' : $scope.runes[runeIndex].runeId,
				'id' : $scope.runes[runeIndex].id
			});
			
			//Get a new rune from the server after a small break.
			setTimeout ( function()
			{
				$scope.runes.splice ( runeIndex, 1 );
				$scope.selectedGroupIndex = -1;
				//socket.emit ( 'tutor get rune', {});
			}, 500);
		}
		/*
        var healthLeft = $scope.health;
        for (var group in question.groupAnswers) {
            if (question.groupAnswers.hasOwnProperty (group)) {
                //Deduct the experience given to the group from the tutor's health and let the server know.
                healthLeft = $scope.health - question.groupAnswers[group].experience;
                socket.emit ('damage shoutout', {
                    'group' : group,
                    'experience' : question.groupAnswers[group].experience
                });
            }
        }

        //Let the server know to grant all students in the lobby the experience payout when the tutor's health is below 0.
        if (healthLeft > 0) {
            $scope.health = healthLeft;
        } else {
            $scope.health = 0;
            socket.emit ('experience payout', uuid);
        }

        socket.emit ('update health', $scope.health);

        socket.emit ('grade question', question);
		*/
    };
});