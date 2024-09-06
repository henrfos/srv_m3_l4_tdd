var express = require('express');
var router = express.Router();
var crypto = require('crypto');
const db = require('../models');
const UserService = require('../services/UserService');
const userService = new UserService(db);


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', async (req, res, next) => {
	const { firstname, lastname, username, password } = req.body;
	try {
	  var salt = crypto.randomBytes(16);
	  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
		if (err) {
		  return next(err);
		}
		let result = await userService.create(firstname, lastname, username, salt, hashedPassword);
		let token = EncodeJWT(result.dataValues.id, result.dataValues.Username)
		res.status(200).json({message: 'User created successfully', data:{token: token}})
	  });
	} catch (err) {
	  res.status(500).json({ error: err.message });
	}
  });

const EncodeJWT = (id, username) => {
	try {
		token = jwt.sign({ id: id, username: username }, process.env.TOKEN_SECRET, { expiresIn: '2h' });
		return token;
	} catch (err) {
		return res.jsend.error({
			statusCode: 400,
			result: 'Something went wrong when creating JWT token',
		});
	}
};

module.exports = router;

