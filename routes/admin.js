var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

	const db = require('../app').db;

	db.any('SELECT * FROM post;')
		.then(data => {
			return res.render('admin', {title: "Dashboard", data: data});
		})
		.catch(err => {
			console.error(err);
			return res.render('error', {message: 'DB error occurred on server side', error: err})
		})

});

router.post('/', function (req, res) {

	const db = require('../app').db;
	const author = req.body.author;
	const title = req.body.title;
	const text = req.body.text;

	db.one('INSERT INTO post (title, body, author) VALUES ($1, $2, $3) RETURNING id;', [title, text, author])
		.then(data => {
			console.log('Created new post ' + data.id);
			return res.redirect('/admin')
		})
		.catch(err => {
			console.error(err);
			return res.redirect('/admin')
		})

});

module.exports = router;
