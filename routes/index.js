var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

	const db = require('../app').db;

	db.any('SELECT * FROM post;')
		.then(data => {
			return res.send({success: true, data: data})
		})
		.catch(err => {
			console.error(err);
			return res.send({success: false, error: err})
		})

});

router.post('/updates', function (req, res) {

	const lastPostId = req.body.lastId;
	const db = require('../app').db;

	db.any('SELECT * FROM post WHERE id > $1;', [lastPostId])
		.then(data => {
			if (data.length > 0) {
				console.log('Updates called with last id: ' + lastPostId);
				return res.send({success: true, data: data})
			} else
				return res.send({success: false})
		})
		.catch(err => {
			console.error(err);
		})
});

module.exports = router;
