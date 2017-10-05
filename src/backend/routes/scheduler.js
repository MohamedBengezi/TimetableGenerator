var express = require('express');
var router = express.Router();
var dataset;
var allCourses;
var finalCourses; // The courses user wants to generate time table on.

//dataset.timetables[2017][6].courses
var fullYear = []; // Contains courses that are available only for full year (September - March).
var bothSemesters = []; //Contains courses that are available for both Semesters. Example Macro Economics ECON 1BB3
var semester1 = []; // Contains courses that are available only for first Semesters.
var semester2 = []; //Contains courses that are available only for second Semesters.

var finalSemester1 = []; //Array of course objects for final schedule for first semester 1.
var finalSemester2 =[]; //Array of course objects for final schedule for second semester 2.

//Array of course objects for each day.
var day1=[];
var day2=[];
var day3=[];
var day4=[];
var day5=[];
var day6=[];

/*var times = []; //Contains the day-time of a course, lab or tutorial.
                // An example of its element :208301120f => day 2, start 08:30, end 11:20, fixed (no other option for it).
*/

router.post('/',function (req, res, next) {
    console.log("THESE ARE THE FINAL COURSES \n" );

    dataset = require('../app.js').dataset; //An Array of 'Course' objects that contains detailed information about a course.
    allCourses  = require('../app.js').macCourses; // Object of the data set that contains detailed information about a course.


    var checkCourse = require('./checkCourse');
    finalCourses  = checkCourse.finalCourses;

    algorithm();
});

Array.prototype.multiIndexOf = function (el) {
    var idxs = [];
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === el) {
            idxs.unshift(i);
        }
    }
    return idxs;
};



function algorithm() {

    for ( var i = 0; i < finalCourses.length; i++){
        var indicies = allCourses.multiIndexOf(finalCourses[i]);
        if (indicies.length > 1){
            var firstSem = dataset[indicies[0]];
            var secondSem = dataset[indicies[1]];
            var bothSem = [firstSem,secondSem];
            bothSemesters.push(bothSem);
        }
        else{
           var term = dataset[indicies[0]].term;
           console.log("This is the term " + term);
           if(term == '2'){
               semester1.push(dataset[indicies[0]]);
           }
           if(term == '5'){
               semester2.push(dataset[indicies[0]]);
           }
           else{
               fullYear.push(dataset[indicies[0]]);
           }
        }
    }
    console.log("Semester 1 " +semester1);
    console.log("Semester 2 " +semester2);
    console.log("Both Semesters " + bothSemesters);
    try {

        doSemester1();
        doSemester2();
    }

    catch (Exception){
        console.log(Exception);
    }
};


function doSemester1() {
    console.log("\n --- SEMESTER 1 --- \n");
    console.log(semester1.length + "\n");
    for (var i=0; i < semester1.length; i++){
        if (semester1[i].lectureTimes.length === 1){
            finalSemester1.push(semester1[i]);

            console.log("Fixed course " + semester1[i].name);
        }
        else{
            console.log("Flexible Course " + semester1[i].name);
        }
    }
}

function doSemester2() {
    console.log("\n --- SEMESTER 2 --- \n");
    console.log(semester2.length + "\n");
    for (var i=0; i < semester2.length; i++){
        if (semester2[i].lectureTimes.length === 1){
            finalSemester2.push(semester2[i]);
            console.log("Fixed course --semester 2" + semester2[i].name);
        }
        else{
            console.log("Flexible Course --semester 2" + semester2[i].name);
        }
    }
}

function dobothSemester() {
    
}

/*
    This function takes a courseDay(day of a lecture, tutorial, or lab), the corresponding course object and puts it
    in the appropriate array.
 */
function putInaDay(courseDay, course){
    switch (courseDay){
        case "1":
            day1.push(course);
            break;

        case "2":
            day2.push(course);
            break;

        case "3":
            day3.push(course);
            break;

        case "4":
            day4.push(course);
            break;

        case "5":
            day5.push(course);
            break;

        case "6":
            day6.push(course);
            break;
    }
}


module.exports = router;
module.exports.reset = function () { // To reset all the values when the page is reloaded.
    finalCourses = [];
    fullYear = [];
    bothSemesters = [];
    semester1 = [];
    semester2 = [];
    finalSemester1 = [];
    finalSemester2 = [];

};