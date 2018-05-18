var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login');
});

/* GET login page. */
router.get('/demo', function(req, res, next) {
    res.render('demo');
});

router.post('/login', function(req, res, next) {

    res.redirect('../chat'+req.body.nickname+"&"+req.body.room+"&"+req.body.language);
});

/* GET chat page. */
router.get('/chat:nickname&:room&:language', function(req, res, next) {
    let nickname = req.params.nickname;
    let room = req.params.room;
    let language = req.params.language;
    res.render('chat',{nickname:nickname, room:room,language:language});
});

module.exports = router;