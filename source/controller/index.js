/**
 * @module controllers/index
 * @type {*|exports|module.exports}
 */

/**
 * Default index page
 * return HTML
 * @param req
 * @param res
 * @param next
 */
var get = function (req, res, next)
{

	var user;
	var auth = req.body.auth;
	var user;
	if (auth.success) {
		user = auth.decoded;
	} else {
		console.log('auth failed');
	}
	var failedLogin = false;
	if ( req.params.failureBit )
	{
		failedLogin = true;
	}
	res.render
	(
		'index',
		{
			title: 'E-Tutorial - Login',
			user: user,
			failedLogin : failedLogin,
			ip: req.app.get('server-ip'),
			port: req.app.get('server-port')
		}
	);
}

module.exports.get = get;