var express = require('express');
var auth = require('../auth');
var rest = require('rest');
var app = require('../../app');
var level = require('./level');
var db = require('./db');


var protocol = 'https';
var usehttps = app.get('use-https');
if (!usehttps) {
	protocol = 'http';
}


/**
 * Render dashboard page
 * returns HTML
 * @param req
 * @param res
 * @param next
 */
 
 var errorMessage = "";
 
 var get = function (req, res, next) {

 	if (req.body.auth.success) {
 		console.log(req.body.auth.decoded);
 		res.render('dashboard', {
 			user: req.body.auth.decoded,
 			ip: app.get('server-ip'),
 			port: app.get('server-port')
 		});
	} else {
		//res.send('Auth unsuccessful');
		
		var errorMessage = "Unsuccessful Authentication (E1B)";
		
		res.render('error.ejs', {
			errorMessage: errorMessage
		});
	}

}

// Query methods

/**
 * Gets all tutorials of current user.
 * @param uid
 * @returns JSON
 */
var getTutorials = function (req, res, next) {
	if (req.body.auth.success) {
		var user = req.body.auth.decoded;
		var tuts = [];
		db.findAndCountAllTutorials(user.id).then(function (data) {
			for (i = 0; i < data.rows.length; i++) {
				tuts.push(data.rows[i].dataValues);
			}
			res.json({success: true, message: 'Success', data: data});
		});
	} else {
		var errorMessage = "Permission Denied (E2B)";
		res.render('error.ejs', {
			errorMessage: errorMessage
		});
	}
}

var getAvatars = function (req, res, next) {
	db.getAllAvatars().then(function (result) {
		res.json({success: true, message: 'Success', data: result});
	});
}


var getUserInfo = function (req, res, next) {
	if (req.body.auth.success) {
		var user = req.body.auth.decoded;
		db.getUserInfo(user.id).then(function (result) {
			userTuts = processUserInfo(result);
			res.json({success: true, message: 'Success', data: userTuts});
		});
	} else {
		//res.send("Permission denied");
		var errorMessage = "Permission Denied (E2D)";
		
		res.render('error.ejs', {
			errorMessage: errorMessage
		});
	}
}

/**
 * Processes the user info object for use in UI
 * @param  result
 * @return JSON
 */
var processUserInfo = function (result) {
	var user = result.rows[0];
	var returnObject = {}
	returnObject.name = user.name;
	returnObject.avatar = user.Avatar.rows[0].dataValues;
	var tuts = user.Tutorial.rows;
	var tutArray = [];
	for (i = 0; i < tuts.length; i++) {
		var tut = tuts[i];
		tutArray.push ({
			coursecode: tut.coursecode,
			coursename: tut.coursename,
			name : tut.name,
			week : tut.week,
			day : tut.day,
			time : tut.time,
			description : tut.description,
			exp: tut.userTutorial.exp,
			role: tut.userTutorial.role,
			level: level.calculateLevel(tut.userTutorial.exp)
		});
	}
	var totalLevels = 0;
	var totalExp = 0;
	for (i = 0; i < tutArray.length; i++) {
		totalLevels += tutArray[i].level;
		totalExp += tutArray[i].exp;
	}
	returnObject.totalLevels = totalLevels;
	returnObject.totalExp = totalExp;
	returnObject.tutorials = level.setLevelInfo(tutArray);
	return returnObject;
}

/**
 * Get top users in tutorial for leaderboard
 * @param  req
 * @param  res
 * @param  next
 * @return JSON
 */
var getTopUsers = function (req, res, next) {
	var tid = req.body.tid;
	db.findAndCountAllUsersInTutorial(tid).then(function (result) {
		var result = processTopUsers(result);
		res.json({success: true, message: 'Success', data: result});
	});
}

/**
 * Process JSON for UI usage
 * @param  JSON  data
 * @return JSON     
 */
var processTopUsers = function (data) {
	var userArray = [];
	for (i = 0; i < data.rows.length; i++) {
		var user = data.rows[i];
		if (user.dataValues.Tutorials[0].userTutorial.role == "student") {
			var exp = user.dataValues.Tutorials[0].userTutorial.exp;
			userArray.push({
				name: user.dataValues.name,
				exp: exp,
				level: level.calculateLevel(exp)
			});
		}
	}
	userArray.sort(sort_by('exp', true, parseInt));
	console.log(userArray);
	return userArray;
}

var setAvatar = function (req, res, next) {
	var uid = req.body.auth.decoded.id;
	var aid = req.body.avatarId;
	db.setUserAvatar(uid, aid).then(function (result) {
		res.json({ success: true, message: 'Success', data : result });
	});
}

var buyAvatar = function (req, res, next) {
	var uid = req.body.auth.decoded.id;
	var aid = req.body.aid;
	var price = req.body.price;
	db.addAvatarToUser(uid, aid).then(function (result) {
		db.increaseLevelsSpent(uid, price).then(function (result) {
			res.json({ success: true, message: 'Success' });
		});
	});
}


/**
 * JSON object sorting function
 */
var sort_by = function(field, reverse, primer){

   var key = primer ? 
       function(x) {return primer(x[field])} : 
       function(x) {return x[field]};

   reverse = !reverse ? 1 : -1;

   return function (a, b) {
       return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
     } 
}

module.exports.get = get;
module.exports.getTutorials = getTutorials;
module.exports.getUserInfo = getUserInfo;
module.exports.getTopUsers = getTopUsers;
module.exports.getAvatars = getAvatars;
module.exports.setAvatar = setAvatar;
module.exports.buyAvatar = buyAvatar;