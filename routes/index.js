var express = require('express');
var router = express.Router();
let conf = require('../private/conf.json');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).render('index', {
		title: 'Morpion',
		css_links: [
			'/stylesheet/general.css',
			'/stylesheet/index.css'
		]});
});

module.exports = router;
