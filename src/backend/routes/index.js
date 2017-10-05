var express = require('express');
var router = express.Router();
var reload = require('./checkCourse').reloadReset;
var schedulerReload = require('./scheduler').reset;
/* GET home page. */
router.get('/', function(req, res, next) {
    reload();
    schedulerReload();
    res.render('index', { title: 'Express' });
    res.end();
});

router.post('/getlink',function (req,res,next) {
    var courses = require('../app').macCourses;
    res.send(courses);
    res.end();
})

module.exports = router;
