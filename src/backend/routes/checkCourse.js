var express = require('express');
var router = express.Router();
var selectedCourses = [];

router.post('/remove/:courseId',function (req, res, next) {
    console.log("Removing "+req.params.courseId + "--index--"+selectedCourses.indexOf(req.params.courseId));
    delete selectedCourses[selectedCourses.indexOf(req.params.courseId)];
    res.end();
});
router.post('/:courseId',function (req, res, next) {
    var courses = require('../app').macCourses;
    console.log("First course is " + courses);
    var course = req.params.courseId;
    console.log("Course is " +course);
    console.log(courses.indexOf(course));
    if(courses.indexOf(course) < 0){
        console.log('Entered course is invalid');
        res.send("error");
        res.end();
    }
    else{
        if (selectedCourses.indexOf(course) < 0){
            console.log('Entered course is right');
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



module.exports = router;