var express = require('express');
var router = express.Router();
var selectedCourses = [];
selectedCourses=['PHYSICS-1E03','ENGINEER-1P03','PHYSICS-1D03','CHEM-1E03','MATH-1ZA3','MATH-1ZC3','MATH-1ZB3','MATLS-1M03','ENGINEER-1C03','ENGINEER-1D04','ECON-1BB3','ECON-1B03'];


router.post('/remove/:courseId',function (req, res, next) {
    console.log("\n \n REMOVING \n \n");
    selectedCourses.splice(selectedCourses.indexOf(req.params.courseId),1);
    res.end();
});


router.post('/submit',function (req, res, next) {
    if(selectedCourses.length === 0){
        res.send('error');
        res.end();
        return;
    }
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