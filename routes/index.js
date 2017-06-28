var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).render('index', {
		title: 'Morpion',
		css_links: [
			'/stylesheet/general.css',
			'/stylesheet/index.css'
		]
	});
});

/*GET play game page*/
router.get('/play', (req, res, next) => {
	res.status(200).render('play', {
		title: "Select a room",
		css_links: [
			'/stylesheet/general.css',
			'/stylesheet/play.css'
		]
	})
});

module.exports = router;
