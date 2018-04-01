/**
 * Controller for tutorial and leaderboard display in dashboard screen.
 *
 * @module javascripts/dashboard/dashbaord-module-controller
 */
 angular.module("dashboardApp", []);
 
angular.module("dashboardApp").controller ('dashboardCtrl', function ($scope, $http, $window) {

    $scope.tuts = [];
	$scope.avatars = [];
	$scope.userInfo = {};
	$scope.selectedTutorialIndex = 0;
	$scope.selectedAvatarIndex = 0;
	$scope.selectedRune = 0;
	$scope.selectedList = 'modules';

	$http({
        method: 'POST',
        url: '/api/dashboard/getUserInfo'
    }).then(function successCallback(response) {
        var userInfo = response.data.data;
        userInfo.name = toTitleCase(userInfo.name);
		userInfo.tutor = false;
		for ( var i = 0; i < userInfo.tutorials.length; i++ )
		{
			if (userInfo.tutorials[i].role == 'tutor')
			{
				userInfo.tutor = true;
			}
		}
        $scope.userInfo = userInfo;
		
		$http({
			method: 'POST',
			url: '/api/dashboard/getAvatars'
		}).then(function successCallback(response) {
			var avatars = response.data.data.rows;
			var avatarsToRemove = [];
			for (var i = 0; i < avatars.length; i++) {
				//If the avatar is a student avatar when the user is a tutor remove it from the list.
				if ( (avatars[i].type == "student" && userInfo.tutor) || (avatars[i].type == "tutor" && !userInfo.tutor) )
				{
					avatarsToRemove.push (i);
				}
				var runes = [];
				for ( var rune in avatars[i].runes )
				{
					for ( var j = 0; j < avatars[i].runes[rune].length; j++ )
					{
						runes.push (avatars[i].runes[rune][j]);
					}
				}
				avatars[i].runes = runes;
			}
			
			avatarsToRemove.sort();
			
			for ( var i = avatarsToRemove.length - 1; i >= 0; i-- )
			{
				avatars.splice ( avatarsToRemove[i], 1);
			}				
			
			$scope.avatars = avatars;
		}, function errorCallback(response) {
			console.log(response);
		});
		
    }, function errorCallback(response) {
        console.log(response);
    });
	
	
	
	$http({
		method: 'POST', 
		url: '/api/dashboard/getTutorials'
	}).then(function successCallback (response) {
		var tuts = response.data.data.rows;
		$scope.tuts = tuts;
	}, function errorCallback(response) {
		console.log('Error: ' + response.message);
	});


    $scope.redirect = function(tut) {
        $window.location.href = 'lobby/'+tut.coursecode+'/'+tut.name;
    }
	
	$scope.selectTutorialIndex = function ( index ) {
		$scope.selectedTutorialIndex = index;
	};
	
	$scope.selectAvatarIndex = function ( index ) {
		$scope.selectedAvatarIndex = index;
		$scope.selectedRune = 0;
	};
	
	$scope.selectList = function ( value ) {
		$scope.selectedList = value;
	};
	
	$scope.scrollRuneList = function (direction) {
		var newIndexRange = $scope.selectedRune + direction;
		if ( newIndexRange >= 0 && newIndexRange < $scope.avatars[$scope.selectedAvatarIndex].runes.length )
		{
			$scope.selectedRune = newIndexRange;
		}
    }

	$scope.setAvatar = function ( avatarId ) {
		
		$http({
			method: 'POST',
			url: '/api/dashboard/setAvatar',
			data: { 'avatarId': avatarId }
		}).then (function successCallback ( response ) {
			console.log ( response );
		}, function errorCallback(response) {
			console.log(response);
		});
	};
});

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

