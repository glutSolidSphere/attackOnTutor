/**
 * Controller for the tutor functionalities within the lobby.
 * Front-end javascript code inside public folder.
 *
 * @module javascripts/lobby/lobby-angular-tutor-controller
 */
angular.module('lobbyApp').controller ('tutorCtrl', function($scope, socket) {
	$scope.showPrompt = false;
    $scope.userInfo = {};
	$scope.socket = socket;
    $scope.health = 100;
    $scope.maxHealth = 100;
	$scope.selectedGroups = [];
	$scope.groupRangeIndex = 0;
	$scope.mouseoverGroupIndex = 0
    $scope.composerQuestion = {
        'description' : ''
    };
    $scope.questions = {};

    /*
     *   Listeners for tutor client.
     */

    //Listen for login response from server before initialising everything else.
    socket.on ('login', function (data) {

        $scope.userInfo.imgSrc = data.userAvatar;
        //Ensure the user logged in is a tutor, otherwise do not initialise all these socket listeners.
        if (data.userType == 'tutor') {

            //Receive the answers submitted by student clients for grading from the server.
            socket.on ('submit answer', function (data) {
                var question = $scope.questions[data.uuid];
                if (question) {
                    var groupAnswer = question.groupAnswers[data.answer.groupName];
                    if (groupAnswer) {
                        groupAnswer.answered = true;
                        groupAnswer.student = data.answer.student.username;
                        groupAnswer.description = data.answer.description;
                    }
                }
            });

            //Log the question in this client after it has been sent out to all the students in the selected groups by the server.
            socket.on ('log question', function (data) {
                //Object to store the answers receieved from students later.
                var groupAnswers = {};
                //Each group has its own answer.
                data.question.groups.forEach (function (value) {
                    groupAnswers[value] = {
                        'student' : '',
                        'description' : '',
                        'explanation' : '',
                        'experience' : 0,
                        'answered' : false
                    };
                });

                $scope.questions[data.question.uuid] = {
                    'uuid' : data.question.uuid,
                    'description' : data.question.description,
                    'graded' : false,
                    'groupNames' : data.question.groups,
                    'groupAnswers' : groupAnswers,
                    'selectedGroup' : data.question.groups[0]
                };
            });

            socket.on ('reset health', function (data) {
				$scope.showPrompt = false;
                $scope.health = $scope.maxHealth;
				socket.emit ('update health', $scope.health);
            });
			
			socket.on ('overdrive prompt', function (data) {
				$scope.showPrompt = true;
            });
        }
    });

    /*
     *  Scope functions used by angular in the DOM.
     */
	 
	/**
    * Allow users to iterate through the list of groups.
    *
    */
    $scope.respawn = function () {
		socket.emit ('tutor respawn', {
		});
    }

	/**
    * Allow users to iterate through the list of groups.
    *
    */
    $scope.scrollGroupList = function (direction) {
		var newIndexRange = $scope.groupRangeIndex + direction;
		if ( newIndexRange >= 0 && newIndexRange < ($scope.socket.getAllSocketGroups().length - 3) )
		{
			$scope.groupRangeIndex = newIndexRange;
		}
    }
	
    /**
     * Check if the index of the current group is already selected in the question composer.
     *
     * @param {Integer} index
     * @returns {Boolean}
     */
    $scope.inSelectedGroups = function (index) {
		return ($scope.selectedGroups.indexOf (index) > -1);
	};

    /**
     * Select/deselect a group to send the question to in the question composer.
     *
     * @param {Integer} index
     */
	$scope.toggleSelectedGroup = function (index) {
		if ($scope.inSelectedGroups(index)) {
			$scope.selectedGroups.splice ($scope.selectedGroups.indexOf (index), 1);
		} else {
            //The first group is the default group for the entire lobby.
            if (index == 0) {
                $scope.selectedGroups = [];
            }
            else
            {
                //When any sub groups are selected prevent the tutor from sending to the group that contains the entire tutorial as well.
                if ($scope.inSelectedGroups(0)) {
                   $scope.selectedGroups.splice ($scope.selectedGroups.indexOf (0), 1);
                }
            }
			$scope.selectedGroups.push (index);
		}
	};

    /**
     * Select the group for viewing in the tutor's grading interface.
     *
     * @param {String} uuid
     * @param {Integer} index
     */
    $scope.setSelectedGroup = function (uuid, index) {
        var question = $scope.questions[uuid];

        if (index < question.groupNames.length && index >= 0) {
            question.selectedGroup = question.groupNames[index];
        }
    };

    /**
     * Send the composed question to the server.
     */
	$scope.sendQuestion = function () {
		var groupNames = [];
        //Get the names of all the selected groups.
		$scope.selectedGroups.forEach (function (value) {
            if ($scope.socket.getAllSocketGroups()[value]) {
                groupNames.push ($scope.socket.getAllSocketGroups()[value]);
            }
		});

		socket.emit ('new question', {
			'question' : $scope.composerQuestion,
			'groups' : groupNames
		});
		$scope.composerQuestion = {
			'description' : ''
		};
		$scope.selectedGroups = [];
	};

    /**
     * Check if a question has been answered by the group.
     *
     * @param {String} uuid
     * @returns {Boolean}
     */
    $scope.isQuestionAnswered = function (uuid) {
        var question = $scope.questions[uuid];

        for (var group in question.groupAnswers) {
            if (question.groupAnswers.hasOwnProperty (group)) {
                if (!question.groupAnswers[group].answered) {
                    return false;
                }
            }
        }
        return true;
    };

    /**
     * Send the tutor's explanation and grade back to the server.
     *
     * @param {String} uuid
     * @param {Integer} index
     */
    $scope.gradeQuestion = function (uuid) {
        var question = $scope.questions[uuid];
        question.graded = true;

        var healthLeft = $scope.health;
        for (var group in question.groupAnswers) {
            if (question.groupAnswers.hasOwnProperty (group)) {
                //Deduct the experience given to the group from the tutor's health and let the server know.
                healthLeft -= question.groupAnswers[group].experience;
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
            socket.emit ('tutor death', uuid);
        }

        socket.emit ('update health', $scope.health);

        socket.emit ('grade question', question);
    };
	
	/**
     * Send a message to the server to transmit to the students that the battle has started.
     */
    $scope.startBattle = function () {
		$scope.showPrompt = false;
		socket.emit ('start battle');
	};
});