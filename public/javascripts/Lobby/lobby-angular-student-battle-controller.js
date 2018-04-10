/**
 * Controller for the tutor battle scene functionalities within the lobby.
 * Front-end javascript code inside public folder.
 *
 * @module javascripts/lobby/lobby-angular-tutor-controller
 */
angular.module('lobbyApp').controller ('studentBattleCtrl', function($scope, $window, socket) {
	$scope.socket = socket;
	$scope.groupName = "";
	$scope.userId = $window.userId;
	
	$scope.showBattleWindow = false;
	$scope.showSplash = false;
	$scope.showStartSplash = false;
	$scope.showFinSplash = false;
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
	
	$scope.rankIcons = {
		3 : '/images/crown-b.png',
		2 : '/images/crown-s.png',
		1 : '/images/crown-g.png'
	};
	$scope.bonusLootAmount = 0;
	$scope.rankedGroups = [];
	$scope.rankDisplayTime = 10000;
	
	$scope.loot = [];
	$scope.selectedLootIndex = 0;

	$scope.maxStudentAvatarWidth = 15;
	$scope.minStudentAvatarWidth = 10;
	
    /*
     *   Listeners for student client.
     */

    //Listen for login response from server before initialising everything else.
    socket.on ('login', function (data) {
		console.log (data);
		
        //Ensure the user logged in is a student, otherwise do not initialise all these socket listeners.
        if (data.userType == 'student') {
			$scope.tutorAvatar = data.tutorAvatar;
			$scope.tutorAvatar.currentAnim = data.tutorAvatar.idleAnim;
			$scope.tutorAvatar.username = data.tutorName;
		
            socket.on ('show splash', function (data) {
				$scope.showBattleWindow = true;
				$scope.showStartSplash = true;
				
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
						$scope.groupName = groupMembers[i].group;
						break;
					}
				};
				
				//Get the overdrive duration for the student.
				$scope.currentTime = $scope.battleDuration = data.rewards[$scope.groupName].overdriveDuration;
				
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
					'image' : data.runeData.image,
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
					'image' : data.runeData.image,
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
				'currentTime' : $scope.rankDisplayTime,
				'totalDisplayTime' : $scope.rankDisplayTime,
				'groupPerformance' : data.rewards[group].groupPerformance,
				'topMembers' : [],
				'allMembers' : []
			});
			
			//Get a complete list of all members sorted by rank.
			for ( var i = 0; i < sortedMembersByRank.length; i++ )
			{
				//Store this user's rewards.
				if ( sortedMembersByRank[i] == $window.userId )
				{
					$scope.bonusLootAmount = data.rewards[group].members[sortedMembersByRank[i]].params.reward;
				}
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
			var displayMVPDelay = 2500;
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
			}, displayMVPDelay );
		}
		else
		{
			//End of all the groups.
			socket.emit ( 'finish splash', {});
			socket.emit ( 'student get rune', { 
					});
					
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
     * Select the loot index.
	 *
     */
    $scope.selectLoot = function ($index) {
		$scope.selectedLootIndex = $index;
	};
	
	 /**
     * Claim the loot.
	 *
     */
    $scope.claimLoot = function () {
		$scope.showFinSplash = true;
		setTimeout ( function()
		{
			$scope.$apply (function() {
				$scope.showEndSplash = false;
				$scope.showBattleWindow = false;
				$scope.showFinSplash = false;
			});
		}, 1000);
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
				console.log (member);
				if ( member.userType == 'student' )
				{
					var studentHeight = studentWidth * (member.userAvatar.height/member.userAvatar.width);
					if ( member.userId == $scope.userId )
					{
						member.userAvatar.width = studentWidth + 3;
						member.userAvatar.height = studentHeight + 3;
						parsedGroupMembers.unshift ({
							'username' : member.username,
							'userId' : member.userId,
							'userAvatar' : member.userAvatar,
							'currentAnim' : member.userAvatar.idleAnim,
							'displacementBottom' : 0,
							'displacementRight' :  withinGroupInterval
						});
					}
					else
					{
						member.userAvatar.width = studentWidth;
						member.userAvatar.height = studentHeight;
						parsedGroupMembers.push ({
							'username' : member.username,
							'userId' : member.userId,
							'userAvatar' : member.userAvatar,
							'currentAnim' : member.userAvatar.idleAnim,
							'displacementBottom' : (Math.random() * (3 - (-3)) + (-3)), //TODO: Make this displacement a bit more random to distribute the students.
							'displacementRight' :  withinGroupInterval - (Math.random() * 2)
						});
					}
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