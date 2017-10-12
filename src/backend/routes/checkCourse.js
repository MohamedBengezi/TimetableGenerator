var express = require('express');
var router = express.Router();
var selectedCourses = [];



router.post('/remove/:courseId',function (req, res, next) {
    console.log("\n \n REMOVING \n \n");
    selectedCourses.splice(selectedCourses.indexOf(req.params.courseId));
    res.end();
});


router.post('/submit',function (req, res, next) {
    module.exports.finalCourses = selectedCourses;
    res.end();
});

router.post('/:courseId',function (req, res, next) {
    var courses = require('../app').macCourses;
    var course = req.params.courseId;
    if(courses.indexOf(course) < 0){
        res.send("error");
        res.end();
    }
    else{
        if (selectedCourses.indexOf(course) < 0){
            selectedCourses.push(course);
            res.status(200);
            res.render('check',{"value":selectedCourses});
            res.end();
        }
        else {
            res.send('added');
            res.end();
        }
    }
});

router.get('/showCourses',function (req,res,next) {
    res.status(200);
    if (selectedCourses.length < 1){
        res.send("<h4 id='info'>Added courses will appear here </h4>");
    }
    else{
        res.render('check',{"value":selectedCourses});
    }
    res.end();
});

module.exports = router;
module.exports.reloadReset = function () {
    selectedCourses = [];
};