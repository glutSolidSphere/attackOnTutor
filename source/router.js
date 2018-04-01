/**
 * Router
 * @type {*|exports|module.exports}
 */
var express = require ('express');
var router = express.Router ();

var auth = require('./auth');
var index = require ('./controller/index');
var lobby = require ('./controller/lobby');
var login = require ('./controller/login');
var dashboard = require('./controller/dashboard');
var error = require('./controller/error');

router.get ('/lobby/:moduleId/:tutorialId', auth.ensureAuth, lobby.enterLobby, lobby.get);
router.post ('/lobby/:moduleId/:tutorialId', auth.ensureAuth, lobby.enterLobby, lobby.get);

router.get ('/', auth.ensureAuth, index.get);
router.get ('/loginFailure/:failureBit', auth.ensureAuth, index.get);
//Non-IVLE login
router.get ('/login/:userId/:hash', auth.ensureAuth, login.get);
router.get ('/dashboard', auth.ensureAuth, dashboard.get);

router.get ('/error',
	function (req, res, next)
	{
		var errorMessage = "You Cannot Just Access the Error Page Manually! (E3)";
		
		res.render('error.ejs', {
			errorMessage: errorMessage
		});
	}
);

router.get ('/error/lobbyClosed',
	function (req, res, next)
	{
		console.log ("YES");
		var errorMessage = "There are no tutorial sessions for your group in progress right now!";
		
		res.render('error.ejs', {
			success : false,
			errorMessage: errorMessage
		});
	}
);

router.post('/api/dashboard/getTutorials', auth.ensureAuth, dashboard.getTutorials);
router.post('/api/dashboard/getUserInfo', auth.ensureAuth, dashboard.getUserInfo);
router.post('/api/dashboard/getTopUsers', auth.ensureAuth, dashboard.getTopUsers);
router.post('/api/dashboard/getAvatars', auth.ensureAuth, dashboard.getAvatars);
router.post('/api/dashboard/setAvatar', auth.ensureAuth, dashboard.setAvatar);
router.post('/api/dashboard/buyAvatar', auth.ensureAuth, dashboard.buyAvatar);

router.post('/api/lobby/enterLobby', auth.ensureAuth, lobby.enterLobby);
router.post('/api/lobby/getUsersInTutorial', auth.ensureAuth, lobby.getUsersInTutorial);

module.exports = router;