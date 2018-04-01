//var User = models.User;
var User = require ('../../models/user');
//var Tutorial = models.Tutorial;
var Tutorial = require ('../../models/tutorial');
//var Avatar = models.Avatar;
var Avatar = require ('../../models/avatar');
//var userTutorial = models.userTutorial;
var userTutorial = require ('../../models/userTutorial');
//var userAvatar = models.userAvatar;
var userAvatar = require ('../../models/userAvatar');
var level = require ('./level');


/**
 * Change user EXP
 * @param  uid
 * @param {int} amount [Amount of points to increase/decrease by]
 * @return {Promise}
 */
var changeExp = function (uid, tid, amount) {
	console.log ( uid + "    " + tid );
	return userTutorial.findOne({
		where: {
			userId: uid,
			tutorialId: tid
		}
	}).then(function (result) {
		console.log ( "Yes" );
		console.log ( result );
		return result.increment(['exp'], { by: amount });
	});
}

/**
 * Find and count all tutorials of one user
 * @param uid
 * @returns {Promise}
 */
var findAndCountAllTutorials = function (uid) {
	//Should process the promise here.
	return ( new Promise ( function (resolve, reject) {
		resolve ( Tutorial.findAndCountAll ({
			include: [{
				model: User,
				attributes: ['id'],
				where: {id: uid}
			}]
		}));
	}));
	/*return Tutorial.findAndCountAll ({
		include: [{
			model: User,
			attributes: ['id'],
			where: {id: uid}
		}]
	});*/
};

/**
 * Find and count all users in some tutorial
 * @param tid
 * @returns {Promise}
 */
var findAndCountAllUsersInTutorial = function(tid){
	return ( new Promise ( function (resolve, reject) {
		resolve ( User.findAndCountAll({
			include:[
				{
					model: Tutorial,
					where: {id: tid}
				},
				{
					model: Avatar
				}
			],
			attributes:['id','name', 'avatarId']
		}));
	}));
};


/**
 * Gets user info along with tutorials and avatars
 * @param  uid
 * @return Promise
 */
var getUserInfo = function (uid) {
	return ( new Promise ( function (resolve, reject) {
		resolve ( User.findAndCountAll({
			where: {
				id: uid
			},
			include: [
				{ model: Tutorial },
				{ model: Avatar }
			]
		}));
	}));
}

/**
 * Gets tutorial by coursecode and name
 * @param  {String} coursecode
 * @param  {String} name
 * @return Promise
 */
var getTutorialByCoursecodeAndName = function (coursecode, name) {
	return Tutorial.findOne({
		attributes: ['id'],
		where: {
			coursecode: coursecode,
			name: name
		}
	});
}

/**
 * Check if user is in tutorial
 * @param uid
 * @param tid
 * @returns {Promise}
 */
var checkIfInTutorialUserList = function (uid, tid) {
	return userTutorial.find (
		{
			where: {
				tutorialId: tid,
				userId: uid
			}
		}
	);
}


/**
 * Find tutorial tutor's ID by tutorial ID
 * @param tid
 * @returns {Promise}
 */
var findTutorialTutorID = function (tid) {
	return userTutorial.find (
		{
			attributes: ['userId'],
			where: {
				tutorialId: tid,
				role: 'tutor'
			}
		}
	);
};

/**
 * Find tutorial info by tutorial id
 * @param tid
 * @returns {Promise}
 */
var findTutorialInfo = function (tid) {
	return ( new Promise ( function (resolve, reject) {
		resolve ( Tutorial.findAll({
			where: {
				id: tid
			}
		}));
	}));
}

/**
 * Gets all avatars currently in database.
 * @return {Promise}
 */
var getAllAvatars = function () {
	return ( new Promise ( function (resolve, reject) {
		resolve (  Avatar.findAndCountAll({
		}));
	}));
}

/**
 * Sets users avatar
 * @param  uid  userId
 * @param  aid  avatarId
 * @return {Promise}
 */
var setUserAvatar = function(uid, aid) {
	
	var userTutorials = userTutorial.findAll ({
		'where' :
		{
			'userId' : uid
		}
	});
	
	return Avatar.findOne ({
		'where' :
		{
			'id' : aid
		}
	}).then ( function (avatar) {
		if ( avatar !== null )
		{
			var totalExp = 0;
			for ( var i = 0; i < userTutorials.rows.length; i++ )
			{
				totalExp += userTutorials.rows[i].exp;
			}
			
			var currentLevel = level.calculateLevel ( totalExp );
			
			return userAvatar.findOne({ where: {UserId: uid} }).then(function (user) {
				if ( user !== null )
				{
					if ( currentLevel >= avatar.exp )
					{
						user.update({ AvatarId: aid });
						return true;
					}
				}
				return false;
			});
		}
		
		return false;
	});
}

/**
 * Increase user's levels spent
 * @param  uid
 * @param  amount
 * @return  {Promise}
 */
var increaseLevelsSpent = function (uid, amount) {
	return User.findOne({ where: { id: uid }}).then(function (user) {
		if ( user !== null )
			return user.increment(['levelsSpent'], { by: amount });
	});
}

/**
 * Adds avatar to user
 * @param uid
 * @param avatarId
 * @return {Promise}
 */
/*var addAvatarToUser = function (uid, avatarId) {
	return User.findOne({ where: { id: uid} }).then(function (user) {
		if ( user !== null )
			return user.addAvatar(avatarId);
	});

}*/

module.exports.changeExp = changeExp;
module.exports.findAndCountAllUsersInTutorial =  findAndCountAllUsersInTutorial;
module.exports.getUserInfo = getUserInfo;
module.exports.getTutorialByCoursecodeAndName = getTutorialByCoursecodeAndName;
module.exports.checkIfInTutorialUserList = checkIfInTutorialUserList;
module.exports.findTutorialTutorID = findTutorialTutorID;
module.exports.findTutorialInfo = findTutorialInfo;
module.exports.findAndCountAllTutorials = findAndCountAllTutorials;
module.exports.getAllAvatars = getAllAvatars;
module.exports.setUserAvatar = setUserAvatar;
//module.exports.addAvatarToUser = addAvatarToUser;
module.exports.increaseLevelsSpent = increaseLevelsSpent;
