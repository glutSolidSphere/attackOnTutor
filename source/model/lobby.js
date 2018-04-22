/**
 * Server side code for the lobby, manages socket events and communication between clients within the lobby page.
 *
 * @module model/lobby
 * @type {*|exports|module.exports}
*/

var app = require ('../../app');
var io = require ('socket.io')();
var db = require('../controller/db');
var LobbyModule = require ('../controller/lobby');
var lobbyio = io.of ('/lobby');

const util = require ('util');

var lobbyList =  new LobbyList();

var listen = function (server) {
	io.listen (server);
	console.log('Server Started and Socket listened on ' + server);
}

/**
 * List to store the all the lobbies in use.
 * Each tutorial group within a module will have its own lobby inside this list.
 * 2-Dimensional hashmap used to store lobbies, first key being the moduleId, and the second key the tutorialId.
 *
 * @constructor
 */

function LobbyList () {
    this.lobbyCount = 0,
    this.lobbies = {}
}

/**
 * Add a lobby to the LobbyList.
 *
 * @param {roomData}
 *      roomData {
 *          moduleId : {string},
 *          tutorialId : {string},
 *          namespace : {string} concatenation of the form "[moduleId]/[tutorialId]"
 *      }
 * @returns {lobby}
 */
LobbyList.prototype.addLobby = function (roomData) {
	if (!this.lobbies[roomData.moduleId]) {
		this.lobbies[roomData.moduleId] = {};
	}
	if (!this.lobbies[roomData.moduleId][roomData.tutorialId]) {
		this.lobbies[roomData.moduleId][roomData.tutorialId] = new Lobby();
		this.lobbies[roomData.moduleId][roomData.tutorialId].tutorialId = roomData.tutorialId;
		this.lobbies[roomData.moduleId][roomData.tutorialId].moduleId = roomData.moduleId;
		this.lobbies[roomData.moduleId][roomData.tutorialId].namespace = roomData.namespace;
		this.lobbyCount++;
	}
	return this.lobbies[roomData.moduleId][roomData.tutorialId];
}

/**
 * Remove a lobby from the LobbyList.
 *
 * @param {roomData}
 *      roomData {
 *          moduleId : {string},
 *          tutorialId : {string},
 *          namespace : {string} concatenation of the form "[moduleId]/[tutorialId]"
 *      }
 * @returns {boolean}
 */
LobbyList.prototype.removeLobby = function (roomData) {
	if (this.lobbies[roomData.moduleId][roomData.tutorialId]) {
		delete this.lobbies[roomData.moduleId][roomData.tutorialId];
		this.lobbyCount--;
		return true;
	}
	return false;
}

/**
 * Get the lobby for the given module and tutorial id.
 *
 * @param {String} moduleId
 * @param {String} tutorialId
 * @returns {lobby}
 */
LobbyList.prototype.getLobby = function (moduleId, tutorialId) {
    if (this.lobbies[moduleId])
        return this.lobbies[moduleId][tutorialId];
    else
        return null;
}

/**
 * Lobby object to store the required data for the tutorial session.
 *
 * @constructor
 */
function Lobby () {
    this.tutorialId = '';
    this.moduleId = '';
	this.namespace = '';
    
	this.groupCount = 0;
	this.groups = {};

    this.questions = {};
    
    this.numUsers = 0;
	
	this.maxHealth = 100;
	
	this.battleDuration = 30000;
	this.battleStarted = false;
	
	/* 
	Used to keep track of scores before overdrive mode.
	Example of how the contents of this map are set up.
	{
		'Group Name' : {
			'totalDamage' : X,
			'overdriveDuration' : C,
			'timeElapsed' : D,
			'finished' : false,
			'members' : {
				'A0123456B' : {
					'answersSubmitted' : Y
				}
			}
		}
	}
	*/
	this.rewards = {};
	this.performanceMap = {};
	//Store the parameters for the current overdrive round, used in calculating the contribution of groups and students.
	this.currentRoundParameters = {
		'totalDamage' : 0,
		'totalQuestions' : 0,
		'groupsFinished' : 0,
		'overdriveDamage' : 0
	};
	
	//Rewards for the groups and players.
	this.performanceRewards = {
		'groupRewards' : {
			'gold' : {
				'reward' : 10000,
				'cutoff' : 50,
				'rank' : 1
			},
			'silver' : {
				'reward' : 5000,
				'cutoff' : 30,
				'rank' : 2
			},
			'bronze' : {
				'reward' : 0,
				'cutoff' : 0,
				'rank' : 3
			}
		},
		'playerRewards' : {
			'gold' : {
				'reward' : 5,
				'cutoff' : 50,
				'rank' : 1
			},
			'silver' : {
				'reward' : 3,
				'cutoff' : 25,
				'rank' : 2
			},
			'bronze' : {
				'reward' : 0,
				'cutoff' : 0,
				'rank' : 3
			}
		}
	};
	
	this.lootTable = [
		{
			'name' : 'Common Knowledge',
			'type' : 'experience',
			'value' : 20,
			'icon' : '/images/items/common_knowledge.gif',
			'rarity' : 100,
			'flavour' : 'That feeling when you have to put Wikipedia in your citations.'
		},
		{
			'name' : 'Deeper Insight',
			'type' : 'experience',
			'value' : 30,
			'icon' : '/images/items/common_knowledge.gif',
			'rarity' : 70,
			'flavour' : "Unleashing your inner academic at a workshop on your university's e-library services."
		},
		{
			'name' : 'Revelation',
			'type' : 'experience',
			'value' : 60,
			'icon' : '/images/items/common_knowledge.gif',
			'rarity' : 40,
			'flavour' : 'You are worthy of the true reality.'
		},
		{
			'name' : 'True Enlightenment',
			'type' : 'experience',
			'value' : 100,
			'icon' : '/images/items/common_knowledge.gif',
			'rarity' : 10,
			'flavour' : 'You done cracked the code.'
		}
	];
}

/**
 * Wrapper to emit the message key with the appropriate callback value to the clients within the lobby.
 * Emit sends the message to ALL clients within the lobby.
 *
 * @param {String} key
 * @param value
 */
Lobby.prototype.emitToLobby = function (key, value) {
    if (this.namespace.length > 0)
        lobbyio.in (this.namespace).emit (key, value);
}

/**
 * Wrapper to emit the message key with the appropriate callback value to the clients within a subgroup inside the lobby.
 * Emit sends the message to ALL clients within the group.
 *
 * @param {String} group
 * @param {String} key
 * @param {Function} value
 */
Lobby.prototype.emitToGroup = function (group, key, value) {
    if (this.namespace.length > 0) {
        if (this.groups[group]) {
            lobbyio.in (this.namespace + '/' + group).emit (key, value);
        } else if (this.namespace == group) {
            this.emitToLobby (key, value);
        }
    }
}

/**
 * Wrapper to broadcast the message key with the appropriate callback value to the clients inside the lobby.
 * Broadcast sends the message to all clients BUT the socket that sent the message within the lobby.
 *
 * @param {socket} socket
 *      Socket object from socket.io.
 * @param {String} key
 * @param {Function} value
 */
Lobby.prototype.broadcastToLobby = function (socket, key, value) {
    if (this.namespace.length > 0) {
        socket.broadcast.to(this.namespace).emit (key, value);
    }
}

/**
 * Wrapper to broadcast the message key with the appropriate callback value to the clients within the subgroup inside the lobby.
 * Broadcast sends the message to all clients BUT the socket that sent the message within the group.
 *
 * @param {socket} socket
 *      Socket object from socket.io.
 * @param {String} group
 * @param {String} key
 * @param {Function} value
 */
Lobby.prototype.broadcastToGroup = function (socket, group, key, value) {
    if (this.namespace.length > 0) {
        if (this.groups[group]) {
            socket.broadcast.to(this.namespace + '/' + group).emit (key, value);
        } else if (this.namespace == group) {
            this.broadcastToLobby (socket, key, value);
        }
    }
}

/**
 * Parse the group name and append the namespace to it, so different lobby rooms can have subgroups with the same name.
 * Uses the '/' character as a delimiter between namespace and group name to differentiate socket.io rooms.
 * Groups can be imagined as a sub-directory within a namespace, but technically they are all socket.io rooms.
 * e.g. TT2010/G20/GroupName1, TT2010/G20/GroupName2 are two socket.io rooms that share a namespace.
 *
 * @param {String} group
 * @returns {String}
 */
Lobby.prototype.getRoomName = function (group) {
    if (this.groups[group]) {
        return this.namespace + '/' + group;
    } else if (this.namespace == group) {
        return this.namespace;
    }
}

/**
 * Retrieves user data from all the sockets in a socket.io room.
 * User data is returned as an array of objects in the following form:
 *      [{
 *          username: {string},
 *          userType: {string} with value 'student' || 'tutor',
 *          userId: {string},
 *          tutorialId: {string},
 *          socketId: {string}
 *      }]
 *
 * @param {String} roomName
 *      roomName must be in the form "[moduleId]/[tutorialId]/[group]"
 * @returns {Array}
 */
Lobby.prototype.getUsersInRoom = function (roomName) {
    var roomName = this.getRoomName (roomName);
    var userSockets = [];
    var socketsInRoom = lobbyio.adapter.rooms[roomName];
    if (socketsInRoom) {
        for (var socketId in socketsInRoom.sockets) {
            if (socketsInRoom.sockets.hasOwnProperty(socketId)) {
                if (lobbyio.connected[socketId]) {
					//TODO: Update this with all the other relevant information for the battle scene.
                    userSockets.push ({
                        'username' : lobbyio.connected[socketId].username,
                        'userType' : lobbyio.connected[socketId].userType,
                        'userId' : lobbyio.connected[socketId].userId,
                        'tutorialId' : lobbyio.connected[socketId].tutorialId,
						'userAvatar' : lobbyio.connected[socketId].userAvatar,
						'group' : lobbyio.connected[socketId].group,
                        'socketId' : socketId
                    });
                }
            }
        }
    }
    return userSockets;
}

/**
 * Retrieves user data from all the sockets in ALL the socket.io room within the lobby.
 * User data is returned as an array of objects with groupname as the key and an array of the following object as the values:
 *      {
 *          {string} groupname: [{
 *              username: {string},
 *              userType: {string} with value 'student' || 'tutor',
 *              userId: {string},
 *              tutorialId: {string},
 *              socketId: {string}
 *          }]
 *      }
 *
 * @param {String} roomName
 *      roomName must be in the form "[moduleId]/[tutorialId]/[group]"
 * @returns {Object}
 */
Lobby.prototype.getUsersInLobby = function () {
    //Group the users according to the room they are in.
    var rooms = {};
    //Start with the "namespace" room that contains all users in the current tutorial group.
    rooms[this.namespace] = this.getUsersInRoom (this.namespace);
    
    for (var group in this.groups) {
        rooms[group] = this.getUsersInRoom (group);
    }
    
    return rooms;
}

/**
 * Add a group to the lobby.
 *
 * @param {String} group
 */
Lobby.prototype.addGroup = function (group) {
    if (!this.groups[group]) {
        this.groups[group] = group;
        this.groupCount++;
		
		//Clear the performance map when a group is added.
		this.performanceMap = {};
    }
}

/**
 * Remove a group from the lobby.
 * Sockets connected to the socket.io room for that group are removed from the group before the group is removed from the lobby.
 *
 * @param {String} group
 */
Lobby.prototype.removeGroup = function (group) {
    if (this.groups[group]) {
        var groupname = this.namespace + '/' + group;
        var socketsInRoom = lobbyio.adapter.rooms[groupname];
        if (socketsInRoom) {
            for (var socketId in socketsInRoom.sockets) {
                if (socketsInRoom.sockets.hasOwnProperty(socketId)) {
                    if (lobbyio.connected[socketId]) {
                        lobbyio.connected[socketId].leave (groupname);
                    }
                }
            }
        }
        delete this.groups[group];
        this.groupCount--;
		
		//Clear the performance map when a group is removed.
		this.performanceMap = {};
    }
}

/**
 * Get all the groups in the lobby, including the namespace.
 *
 * @returns {Array} allGroups
 */
Lobby.prototype.getAllGroupsInLobby = function () {
    var allGroups = [];
    //Push the namespace, which is effectively a group containing all users in the tutorial.
    allGroups.push (this.namespace);
    for (group in this.groups) {
        allGroups.push ( group );
    }
    return allGroups;
}

/**
 * Add the socket to the socket.io room of that group.
 *
 * @param {socket} socket
 *      Socket object from socket.io.
 * @param {String} group
 */
Lobby.prototype.addSocketToGroup = function (socket, group) {
    if (this.groups[group]) {
        if (socket.group.length > 0 && socket.userType == 'student') {
            //Remove the socket from the group it is currently inside.
            socket.emit ('deleted group', socket.group);
            this.removeSocketFromGroup (socket, socket.group);
        }
        socket.join (this.namespace + '/' + group );
        socket.group = group;
    }
}

/**
 * Remove the socket from the socket.io room of that group.
 *
 * @param {socket} socket
 *      Socket object from socket.io.
 * @param {String} group
 */
Lobby.prototype.removeSocketFromGroup = function (socket, group) {
    if (this.groups[group]) {
        socket.leave (this.namespace + '/' + group);
        socket.group = "";
    }
}

//On connection of each new client socket.
lobbyio.on ('connection', function (socket) {
    var addedUser = false;

    //Listen for new connections and create a lobby if one does not exist yet.
    socket.on ('new connection', function (data) {
        if (addedUser) {
            return;
        }

        var userId = data.userId;
        var lobby;

        //Identify students and tutors.
        if (data.userRole == 'tutor') {
            //Add a lobby to the lobbyList if a tutor connects.
            lobby = lobbyList.addLobby ({
                'tutorialId' : data.tutorialId,
                'moduleId' : data.moduleId,
                'namespace' : data.moduleId + "/" + data.tutorialId 
            });
        } else if (data.userRole == 'student') {
            lobby = lobbyList.getLobby(data.moduleId, data.tutorialId);
            //The lobby is not open to the student yet.
            if (!lobby) {
                socket.emit ('invalid');
                return;
            }
        }
		
        socket.tutorialGroup = data.tutorialId;
        socket.tutorialId = data.tutorialUuid;
		socket.moduleGroup = data.moduleId;
		socket.namespace = lobby.namespace;
        socket.userId = data.userId;
        socket.username = data.username;
        socket.userType = data.userRole;
        socket.group = "";

        //Join the main tutorial group room.
        socket.join ( lobby.namespace );
        socket.namespace = lobby.namespace;

        lobby.numUsers++;
        addedUser = true;
        
        //Update the client that login is successful after retrieving the neccessary data from the database.
        db.findAndCountAllUsersInTutorial(socket.tutorialId).then(function (data) {
            var returnObj = LobbyModule.processLobbyUsers(data);
            if (socket.userType == 'student') {
                var studentAvatar = {};
                var studentExp = 0;
                //Get this socket's data from the list of students retrieved by the database call.
                for (var i = 0; i < returnObj.students.length; i++) {
                    if (returnObj.students[i].id == socket.userId) {
                        studentAvatar = returnObj.students[i].avatar.dataValues;
                        studentExp = returnObj.students[i].exp;
                        break;
                    }
                }
				
                socket.emit ('login', {
                    'tutorAvatar' : returnObj.tutor.avatar.dataValues,
                    'tutorName' : returnObj.tutor.name,
                    'userAvatar' : studentAvatar,
                    'experience' : studentExp,
                    'userType': socket.userType,
                    'username': socket.username,
                    'numUsers': lobby.numUsers,
                    'defaultGroup': lobby.namespace
                });
				
				//TODO: Update this to make the socket store the relevant information necessary for the battle mode.
				socket.userAvatar = studentAvatar;
				
				//TODO: Change this to get the data from the database instead. Can probably store this as a JSON data type.
				socket.runes = studentAvatar.runes;
            } else {
                socket.emit ('login', {
                    'userAvatar' : returnObj.tutor.avatar.dataValues,
                    'userType': socket.userType,
                    'username': socket.username,
                    'numUsers': lobby.numUsers,
                    'defaultGroup': lobby.namespace
                });
				
				//TODO: Update this to make the socket store the relevant information necessary for the battle mode.
				socket.userAvatar = returnObj.tutor.avatar.dataValues;
				
				//TODO: Change this to get the data from the database instead. Can probably store this as a JSON data type.
				socket.runes = returnObj.tutor.avatar.runes;
            }

            //Update the active users list in the other clients.
            updateUsers (lobby, socket);
        
            //Update all clients whenever a user successfully joins the lobby.
            socket.broadcast.to(socket.namespace).emit ('user joined', {
                'username': socket.username,
                'numUsers': lobby.numUsers
            });
        });

        //Initialise the other listeners
        if (addedUser) {
            socket.on ('new message', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                lobby.broadcastToGroup (socket, data.group, 'new message', {
                    'username': socket.username,
                    'message': data.message,
                    'group': data.group
                });
            });

            socket.on ('typing', function (data) {
                socket.broadcast.to(socket.namespace).emit ('typing', {
                    'username': socket.username,
                    'group': data
                });
            });

            socket.on ('stop typing', function () {
                socket.broadcast.to(socket.namespace).emit ('stop typing', {
                    'username': socket.username
                });
            });
            
            //Add or remove sockets from groups.
            socket.on ('edit group', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                var socketIds = data.socketIds;
                var groupname = data.groupname;
                lobby.addGroup (groupname);
                for (var index in socketIds) {
                    if (lobbyio.connected[socketIds[index]]) {
                        lobby.addSocketToGroup (lobbyio.connected[socketIds[index]], groupname);
                        //Tell that socket they have been added to a group to update chat channels.
                        lobbyio.to(socketIds[index]).emit ('added group', groupname);
                    }
                }
                //Update active users list for all connected sockets.
                updateUsers (lobby, socket);
            });

            socket.on ('delete group', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                var groupname = data.groupname;
                var usersInGroup = lobby.getUsersInRoom(groupname);
                usersInGroup.forEach (function (value, i) {
                    //Tell socket to remove chat channel of that group.
                    lobbyio.to(value.socketId).emit ('deleted group', groupname);
                });
                lobby.removeGroup (groupname);
                updateUsers (lobby, socket);
            });

            //Parse tutor's question to be sent to all student clients.
            socket.on ('new question', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);

                data.question.completed = false;
                data.question.graded = false;
                data.question.uuid = generateUUID();
                data.question.groups = data.groups;
                data.question.selectedAnswers = {};
                data.question.answers = {};
                data.question.sourceSocket = socket.id;
				
				for ( var i = 0; i < data.groups.length; i++ )
				{
					if ( !isValidGroup ( data.groups[i], lobby ) )
					{
						socket.emit ( "invalid group", {});
						console.log ( "There is an invalid group selected." );
						//TODO: Make the client side pop up to react to invalid group selection.
						return;
					}
				}

                lobby.questions[data.question.uuid] = data.question;

                //Send the parsed question back to the source socket so they can log the question parameters. (uuid)
                socket.emit ('log question', {
                    'question' : data.question
                });

                //Send this question to all the other sockets in the groups that were selected by the tutor.
                data.groups.forEach (function (groupName, i) {
                    lobby.broadcastToGroup (socket, groupName, 'add question', {
                        'username': socket.username,
                        'groupmates': lobby.getUsersInRoom (groupName),
                        'question': data.question
                    });
                });
            });

            //Send tutor's graded answers/experience to the students.
            socket.on ('grade question', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                lobby.questions[data.uuid]['groupAnswers'] = data.groupAnswers;

                //Send each group's answers to all the other groups.
                lobby.questions[data.uuid].groups.forEach (function (groupName, i) {
                    lobby.broadcastToGroup (socket, groupName, 'grade question', {
                        'username': socket.username,
                        'questionUuid': data.uuid,
                        'groupNames' : lobby.questions[data.uuid].groups,
                        'gradedAnswers': lobby.questions[data.uuid].groupAnswers
                    });
                });

				//Update the current round parameters with the question count.
				lobby.currentRoundParameters.totalQuestions += 1;
				
                //Assign the experience points to each student member of the group.
                lobby.questions[data.uuid].groups.forEach (function (groupName, i) {
					//Store the damage done to the tutor (for overdrive round).
					//Check if the performanceMap contains the group.
					if ( lobby.performanceMap.hasOwnProperty ( groupName ) )
					{
						lobby.performanceMap[groupName].totalDamage += lobby.questions[data.uuid].groupAnswers[groupName].experience;
					}
					//If this is the first answer the group has given, add them to the map first.
					else
					{
						lobby.performanceMap[groupName] = {
							'totalDamage' : lobby.questions[data.uuid].groupAnswers[groupName].experience,
							'overdriveDuration' : lobby.battleDuration,
							'timeElapsed' : 0,
							'finished' : false
						};
					}
					
					//Update the current round parameters with the total experience gained by each group.
					lobby.currentRoundParameters.totalDamage += lobby.questions[data.uuid].groupAnswers[groupName].experience;
				
                    var socketsInGroup = lobby.getUsersInRoom (groupName);
                    socketsInGroup.forEach (function (socketClient, i) {
                        if (socketClient.userType == 'student') {
                            db.changeExp (socketClient.userId, socketClient.tutorialId, lobby.questions[data.uuid].groupAnswers[groupName].experience);
                        }
                    });
                });
            });

            //Send group answer to tutor for grading.
            socket.on ('submit answer', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                var question = lobby.questions[data.uuid];

                //Get the group name of this socket so the tutor knows which group the answer belongs to.
                data.answer['groupName'] = socket.namespace;
                if (socket.group.length > 0) {
                    var groupIndex = question.groups.indexOf (socket.group);
                    if (groupIndex > -1) {
                        data.answer['groupName'] = socket.group;
                    }
                }
				
				//Store the student's id and add to their answer submission count.
				//Check if the performanceMap contains the group first, otherwise create it.
				if ( !lobby.performanceMap.hasOwnProperty ( data.answer['groupName'] ) )
				{
					lobby.performanceMap[data.answer['groupName']] = {
						'totalDamage' : 0,
						'overdriveDuration' : lobby.battleDuration,
						'timeElapsed' : 0,
						'finished' : false,
						'members' : {}
					};
				}
				
				//Check if the performanceMap already has the user's id in it.
				if ( lobby.performanceMap[data.answer['groupName']].members.hasOwnProperty ( socket.userId ) )
				{
					lobby.performanceMap[data.answer['groupName']].members[socket.userId].answersSubmitted += 1;
				}
				else
				{
					lobby.performanceMap[data.answer['groupName']].members[socket.userId] = {
						'answersSubmitted' : 1
					};
				}
					
                lobby.emitToGroup (data.answer['groupName'], 'submit answer', data);
            });

            //Update the answer and votes given by one student for the other students in the group.
            socket.on ('update answer', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                var questionUuid = data.uuid;
                var question = lobby.questions[questionUuid];
                var answers = data.answers;
                var ownAnswer = getOwnAnswers (data.answers);

                //Save the user's answer or update if it already exists on the server side.
                if (!lobby.questions[questionUuid].answers[socket.id]) {
                    lobby.questions[questionUuid].answers[socket.id] = {
                        'description' : ownAnswer.description
                    };
                } else {
                    lobby.questions[questionUuid].answers[socket.id].description = ownAnswer.description;
                }

                //Save the user's selected answer (if any)
                for (var i = 0; i < answers.length; i++) {
                    if (answers[i].selected) {
                        lobby.questions[questionUuid].selectedAnswers[socket.id] = answers[i].student.socketId;
                        break;
                    }
                }
                
                //Count the selected answers from each user.
                var selectedCounts = {};
                for (var answerSocketId in lobby.questions[questionUuid].answers) {
                    if (lobby.questions[questionUuid].answers.hasOwnProperty (answerSocketId)) {
                        //Set the selected count for that specific answer to 0 for recounting.
                        lobby.questions[questionUuid].answers[answerSocketId].selectedCount = 0;

                        for (var selectedAnswerSocketId in lobby.questions[questionUuid].selectedAnswers) {
                            if (lobby.questions[questionUuid].selectedAnswers.hasOwnProperty (selectedAnswerSocketId)) {
                                if (lobby.questions[questionUuid].selectedAnswers[selectedAnswerSocketId] == answerSocketId) {
                                    lobby.questions[questionUuid].answers[answerSocketId].selectedCount++;
                                }
                            }
                        }

                        selectedCounts[answerSocketId] = lobby.questions[questionUuid].answers[answerSocketId].selectedCount;
                    }
                }

                if (question) {
                    if (socket.group.length > 0) {
                        lobby.emitToGroup (socket.group, 'update answer', {
                            'socketId': socket.id,
                            'questionUuid': questionUuid,
                            'answer': ownAnswer.description,
                            'selectedCount': selectedCounts
                        });
                    } else { //The socket has no group and the question was addressed to the whole class.
                        lobby.emitToGroup (socket.namespace, 'update answer', {
                            'socketId': socket.id,
                            'questionUuid': questionUuid,
                            'answer': ownAnswer.description,
                            'selectedCount': selectedCounts
                        });
                    }
                }
            });

            //Send to the whole lobby including the source socket whenever the tutor receives damage (i.e. grades a question.)
            socket.on ('damage shoutout', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                lobby.emitToLobby ('damage shoutout', data);
            });

            //Grant experience to all students in the lobby when the tutor's health is reduced to 0.
            socket.on ('tutor death', function (uuid) {
                socket.emit ('overdrive prompt');
            });
			
			//Grant experience to all students in the lobby when the tutor's health is reduced to 0.
            socket.on ('tutor respawn', function (uuid) {
                socket.emit ('reset health');
            });

            //Update student clients with the tutor's health.
            socket.on ('update health', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                lobby.broadcastToLobby (socket, 'update health', data);
            });
			
			//Update all clients with battle start.
			socket.on ('start battle', function (data) {
				
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
				
				//Do a check to make sure all the students have their own groups before commencing, otherwise send a notification to the tutor that they need to add the students to a group.
				var allUsers = lobby.getUsersInRoom ( lobby.namespace );
				for ( var i = 0; i < allUsers.length; i++ )
				{
					if ( allUsers[i].userType == "student" && allUsers[i].group === "" )
					{
						//TODO: Send back to this socket that all users must be added to a group first.
						return;
					}
				}
				//TODO: Make this also push out the runes that players have to spawn.
				//TODO: Pull out a list of possible runes for EACH socket (can temporarily hard code the list and replace with sql queries later.)
				
				for ( var group in lobby.groups )
				{
					if ( !lobby.performanceMap.hasOwnProperty ( group ) )
					{
						lobby.performanceMap[group] = {
							'totalDamage' : 0,
							'overdriveDuration' : lobby.battleDuration,
							'timeElapsed' : 0,
							'finished' : false,
							'members' : {}
						};
					}
				}
				
				//Calculate all the rewards tiers for each player and groups.
				lobby.rewards = {};
				for ( var groupName in lobby.performanceMap )
				{
					if ( lobby.performanceMap.hasOwnProperty ( groupName ) )
					{
						lobby.rewards[groupName] = {
							'params' : {},
							'overdriveDuration' : 30000,
							'totalQuestions' : lobby.currentRoundParameters.totalQuestions,
							'groupPerformance' : 0,
							'ranking' : 'bronze'
						};
						var groupPerformance = (lobby.performanceMap[groupName].totalDamage / lobby.currentRoundParameters.totalDamage) * 100.0;
						for ( var ranking in lobby.performanceRewards.groupRewards )
						{
							if ( lobby.performanceRewards.groupRewards.hasOwnProperty ( ranking ) )
							{
								//Group performed better than cutoff.
								if ( groupPerformance >= lobby.performanceRewards.groupRewards[ranking].cutoff )
								{
									lobby.rewards[groupName].groupPerformance = groupPerformance;
									lobby.rewards[groupName].ranking = ranking;
									lobby.rewards[groupName].params = lobby.performanceRewards.groupRewards[ranking];
									lobby.rewards[groupName].overdriveDuration = lobby.battleDuration + lobby.performanceRewards.groupRewards[ranking].reward;
									lobby.performanceMap[groupName].overdriveDuration = lobby.battleDuration + lobby.performanceRewards.groupRewards[ranking].reward;
									break;
								}
							}
						}
						var memberRewards = {};
						for ( var member in lobby.performanceMap[groupName].members )
						{
							if ( lobby.performanceMap[groupName].members.hasOwnProperty ( member ) )
							{
								var individualPerformance = (lobby.performanceMap[groupName].members[member].answersSubmitted / lobby.currentRoundParameters.totalQuestions) * 100.0;
								for ( var ranking in lobby.performanceRewards.playerRewards )
								{
									if ( lobby.performanceRewards.playerRewards.hasOwnProperty ( ranking ) )
									{
										//Player performed better than cutoff.
										if ( individualPerformance >= lobby.performanceRewards.playerRewards[ranking].cutoff )
										{
											memberRewards[member] = {
												'params' : lobby.performanceRewards.playerRewards[ranking]
											};
											memberRewards[member].params.answersSubmitted = lobby.performanceMap[groupName].members[member].answersSubmitted;
											break;
										}
									}
								}
							}
						}
						lobby.rewards[groupName].members = memberRewards;
					}
				}
				
				//Emit the different rewards to all students.
                lobby.emitToLobby ('show splash', {
					'userList' : lobby.getUsersInLobby(),
					'groupList' : lobby.getAllGroupsInLobby(),
					'rewards' : lobby.rewards
				});
            });
			
			//Update all clients with battle start.
			socket.on ('finish splash', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
				if ( lobby.battleStarted )
				{
					return;
				}
				lobby.battleStarted = true;
				
				lobby.emitToLobby ( 'start battle', {});
				var battleTimer = setInterval ( function () {
					lobby.emitToLobby ( 'timer tick', {});
					for ( var groupName in lobby.performanceMap )
					{
						if ( lobby.performanceMap.hasOwnProperty ( groupName ) )
						{
							if ( !lobby.performanceMap[groupName].finished )
							{
								if ( lobby.performanceMap[groupName].timeElapsed >= lobby.performanceMap[groupName].overdriveDuration )
								{
									lobby.performanceMap[groupName].finished = true;
									lobby.currentRoundParameters.groupsFinished += 1;
									//TODO: Store the loot on the database side for players in the lobby.
									
									//Push the loot to client side for each player in the group.
									var tutorHealthParams = getTutorCurrentStatus ( lobby.currentRoundParameters.overdriveDamage, lobby.maxHealth );
									var usersInGroup = lobby.getUsersInRoom(groupName);
									usersInGroup.forEach (function (value, i) {
										if ( value.userType == 'student' )
										{
											var totalExp = 0;
											var personalLootBonus = 0;
											if ( lobby.rewards[groupName].members.hasOwnProperty ( value.userId ) )
											{
												personalLootBonus += lobby.rewards[groupName].members[value.userId].params.reward;
											}
											//Generate loot for each player in the group.
											var lootToSpawn = [];
											var totalDeaths = tutorHealthParams.deaths + 1 + personalLootBonus;
											for ( var i = 0; i < totalDeaths; i++ )
											{
												var lootToDrop = [];
												var dropRarity = randomIntFromInterval ( 1, 100 );
												for ( var j = 0; j < lobby.lootTable.length; j++ )
												{
													//Item in the loot table is more common than the drop rarity, so it is one of the possible drops.
													if ( lobby.lootTable[j].rarity >= dropRarity )
													{
														lootToDrop.push ( lobby.lootTable[j] );
													}
												}
												if ( lootToDrop.length > 0 )
												{
													var spawnedLoot = lootToDrop[randomIntFromInterval ( 0, lootToDrop.length - 1 )] 
													lootToSpawn.push ( spawnedLoot );
													totalExp += spawnedLoot.value;
												}
											}
											
											db.changeExp (value.userId, value.tutorialId, totalExp);
											
											//TODO: Make this instead instead just send out an end state thing.
											lobbyio.to(value.socketId).emit ('store loot', {
												'loot' : lootToSpawn,
												'totalExp' : totalExp
											});
										}
									});
									
									//TODO: Check if all the timers for all groups are finished, then clear this interval and send out another message to everyone that round is complete.
									if ( lobby.currentRoundParameters.groupsFinished >= lobby.groupCount )
									{
										lobby.performanceMap = {};
										lobby.currentRoundParameters.totalDamage = 0;
										lobby.currentRoundParameters.totalQuestions = 0;
										lobby.currentRoundParameters.groupsFinished = 0;
										lobby.currentRoundParameters.overdriveDamage = 0;
										//Send out to all clients that it is okay to show the loot.
										lobby.emitToLobby ('show loot screen', {});
										lobby.battleStarted = false;
										clearInterval ( battleTimer );
										break;
									}
									else
									{
										lobby.emitToGroup ( groupName, 'wait for groups', {
											'groupName' : groupName
										});
									}
								}
								else
									lobby.performanceMap[groupName].timeElapsed += 1000;
							}
						}
					}
				}, 1000);
            });
			
			//Update clients with attack from tutor.
			socket.on ('tutor rune attack', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
                
				var runeId = data.runeId;
				var targetGroup = data.targetGroup;
				var symbolSetId = data.id;
				
				lobby.emitToGroup (targetGroup, 'student set rune attack', {
					'runeId' : runeId,
					'runeData' : socket.runes[runeId][symbolSetId]
				});
				
				//Send feedback to all clients of the tutor's attack for visual updates.
				//Group that is targeted + Tutor.
				lobby.emitToLobby ( 'show attack effect', {
					'sourceId' : socket.userId,
					'targetGroup' : targetGroup,
					'effect' : socket.runes[runeId][symbolSetId].effect
				});
            });
			
			//Retrieve rune data for the tutor.
			socket.on ('tutor get rune', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
				//Get a random rune symbol layout.
				var runeObject = getRandomRune (socket.runes);
				//Index of the symbol set used.
				var symbolSetIndex = Math.floor(Math.random()*runeObject.runeData.length);
				var symbolToUse = runeObject.runeData[symbolSetIndex];
				symbolToUse.id = symbolSetIndex;
				socket.emit ( 'tutor set rune', {
					'runeId' : runeObject.key,
					'runeData' : symbolToUse
				});
            });
			
			//Retrieve rune data for the student.
			socket.on ('student get rune', function (data) {
                var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
				//Get a random rune symbol layout.
				var runeObject = getRandomRune (socket.runes);
				//Index of the symbol set used.
				var symbolSetIndex = Math.floor(Math.random()*runeObject.runeData.length);
				var symbolToUse = runeObject.runeData[symbolSetIndex];
				symbolToUse.id = symbolSetIndex;
				socket.emit ( 'student set rune', {
					'runeId' : runeObject.key,
					'runeData' : symbolToUse
				});
            });
			
			//Update clients with attack from student.
			socket.on ('student rune attack', function (data) {
				var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
				
				var runeId = data.runeId;
				var symbolSetId = data.id;
				
				var group = socket.group;
				
				lobby.emitToLobby ( 'show attack effect', {
					'sourceId' : socket.userId,
					'sourceGroup' : group,
					'targetGroup' : "",
					'effect' : socket.runes[runeId][symbolSetId].effect
				});
				
				//TODO: Update attack damage.
				lobby.currentRoundParameters.overdriveDamage += socket.runes[runeId][symbolSetId].damage;
				var tutorHealthParams = getTutorCurrentStatus ( lobby.currentRoundParameters.overdriveDamage, lobby.maxHealth );
				//TODO: Update this ONLY within each group not for everyone.
				lobby.emitToLobby ( 'update battle health', {
					'deaths' : tutorHealthParams.deaths,
					'currentHealth' : tutorHealthParams.currentHealth
				});
			});
        }
    });

    //Listen to when the client disconnects and execute.
    socket.on ('disconnect', function () {
        if (addedUser) {
            var lobby = lobbyList.getLobby(socket.moduleGroup, socket.tutorialGroup);
            --lobby.numUsers;

            //Broadcast to other clients that this client has disconnected
            socket.broadcast.to(socket.namespace).emit ('user left', {
                username: socket.username,
                numUsers: lobby.numUsers
            });

            updateUsers (lobby, socket);
			
			if (lobby.numUsers == 0)
			{
				console.log ("Removing empty lobby.");
				lobbyList.removeLobby ({
					'tutorialId' : socket.tutorialGroup,
					'moduleId' : socket.moduleGroup,
					'namespace' : lobby.namespace
				});
			}
        }
    });
});

/**
 * Make sure the given group is valid, i.e. the group has at least one student in it.
 *
 */
function isValidGroup (groupname, lobby) {
	var usersInRoom = lobby.getUsersInRoom ( groupname );
	for ( var i = 0; i < usersInRoom.length; i++ )
	{
		if ( usersInRoom[i].userType == "student")
		{
			//There is indeed a student within this group, thus it is valid.
			return true;
		}
	}
    return false;
}

/**
 * Parse the total damage sustained by the tutor in battle mode to get the number of "deaths" and the current life's health.
 *
 * @param {Integer} totalDamage
 *     	Total damage sustained by the tutor.
 * @param (Integer) maxHealth
 *		Max health for the tutor.
 * @returns {Object} healthParams
 *		Object with params 'deaths' and 'currentHealth'.
 */
function getTutorCurrentStatus (totalDamage, maxHealth) {
    var deaths = Math.floor (totalDamage / maxHealth);
	var currentHealth = maxHealth - (totalDamage % maxHealth);
	return {
		'deaths' : deaths,
		'currentHealth' : currentHealth
	};
}

/**
 * Get a random rune from a set of runes.
 *
 * @param {Object} runes
 *     	Mapping of runes to runeIds. 
 * @returns {Object} rune
 */
function getRandomRune (runes) {
    var keys = Object.keys (runes);
	var key = keys[keys.length * Math.random() << 0];
	return {
		'key' : key,
		'runeData' : runes[key]
	};
}

/**
 * Get the student's answers from a list of answers recieved from student client.
 *
 * @param {Array} answers
 *      Array of answer objects defined on client side.
 * @returns {Object} answer
 */
function getOwnAnswers (answers) {
    for (var i = 0; i < answers.length; i++) {
        if (answers[i].owned) {
            return answers[i];
        }
    }
}

/**
 * Update all clients connected to the lobby with the latest grouping and users.
 *
 * @param {Object} lobby
 *      Lobby object
 * @param {Object} socket
 *      Socket object from socket.io
 */
function updateUsers (lobby, socket) {
    lobby.emitToLobby ('update users', {
        'userList' : lobby.getUsersInLobby(),
        'groupList' : lobby.getAllGroupsInLobby()
    });
}

/**
 * Generate a UUID.
 *
 * @returns {String} uuid
 */
function generateUUID () {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

/**
 * Generate a random integer within a given interval
 *
 * @param {Integer} min
 * @param {Integer} max
 * @returns {Integer} randomnumber
 */
function randomIntFromInterval (min, max) {
    return Math.floor ( Math.random() * ( max - min + 1 ) + min );
}

module.exports.listen = listen;