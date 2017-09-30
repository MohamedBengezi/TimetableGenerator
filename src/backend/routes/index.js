var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });

});

router.post('/getlink',function (req,res,next) {
    var courses = require('../app').macCourses;
    res.send(courses);
    res.end();
})

module.exports = router;
