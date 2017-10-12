var express = require('express');
var jsgraphs = require('js-graph-algorithms');

var graph; //Graph where each node represents a core and edge represents non-conflict relationship.
var router = express.Router();
var dataset;
var allCourses;
var finalCourses; // The courses user wants to generate time table on.

//dataset.timetables[2017][6].courses
var fullYear = []; // Contains courses that are available only for full year (September - March).
var bothSemesters = []; //Contains courses that are available for both Semesters. Example Macro Economics ECON 1BB3
var semester1 = []; // Contains courses that are available only for first Semesters.
var semester2 = []; //Contains courses that are available only for second Semesters.

var fixedCores = []; //Array of fixed cores for labs, lectures and tutorials
var flexCores = []; //Array of flexible cores for labs, lectures and tutorials.
var finalSemester1 = []; //Array of course objects for final schedule for first semester 1.
var finalSemester2 =[]; //Array of course objects for final schedule for second semester 2.

//Array of course objects for each day.
var day1=[];
var day2=[];
var day3=[];
var day4=[];
var day5=[];
var day6=[];

var times = []; //Contains the array of times a lecture, lab or tutorial that are reserved.
                // 8.5 is considered as a 8:30, 9.0 is considered as 9:00.

var success = true;

router.post('/',function (req, res, next) {
    console.log("THESE ARE THE FINAL COURSES \n" );

    dataset = require('../app.js').dataset; //An Array of 'Course' objects that contains detailed information about a course.
    allCourses  = require('../app.js').macCourses; // Object of the data set that contains detailed information about a course.


    var checkCourse = require('./checkCourse');
    finalCourses  = checkCourse.finalCourses;

    var errorCheck;
    errorCheck = algorithm();
    console.log("Error check Value : ---- " + errorCheck);


  if (errorCheck == false){
        console.log("There is an error");
      router.get('/showError', function (req, res, next) {
          res.status(200);
          return res.render('scheduleError');
      });
        res.send("ERROR");
        res.end();

    }else{console.log("There is no error");
    }
});



function algorithm() {
    for(var i =0; i < 7; i++){ // Initializing all the arrays within time.
        times[i] = [];
    }

    for ( var i = 0; i < finalCourses.length; i++){
        var indicies = allCourses.multiIndexOf(finalCourses[i]);
        if (indicies.length > 1){
            var firstSem = dataset[indicies[0]];
            var secondSem = dataset[indicies[1]];
            var bothSem = [firstSem,secondSem];
            bothSemesters.push(bothSem);
            success = true;
        }
        else{
            var term = dataset[indicies[0]].term;
           console.log("This is the term " + term);
           if(term == '2'){
               semester1.push(dataset[indicies[0]]);
               success = true;
           }
           if(term == '5'){
               semester2.push(dataset[indicies[0]]);
               success = true;
           }
           else{
               fullYear.push(dataset[indicies[0]]);
               success = true;
           }
        }
    }
    console.log("Semester 1 " +semester1);
    console.log("Semester 2 " +semester2);
    console.log("Both Semesters " + bothSemesters);
    try {

       success = doSemester1();
     //   doSemester2();
    }

    catch (Exception){
        console.log(Exception);


    }

    return success;

};


function doSemester1() {
    console.log("\n --- SEMESTER 1 --- \n");
    console.log(semester1.length + "\n");
    // Finds the lecture times, tutorial times and lab times that are fixed and flexible.
    for (var i=0; i < semester1.length; i++){

        if (semester1[i].lectureTimes.length === 1){
            var day = semester1[i].lectureTimes[0][0].day;
            var start = semester1[i].lectureTimes[0][0].start;
            var end = semester1[i].lectureTimes[0][0].end;
            console.log(times[day].indexOf(start));
            console.log('Day ' + day);
            console.log('start ' + start);
            console.log('end ' + end + '\n');

            if(times[day].indexOf(start) < 0 && times[day].indexOf(end) < 0){
                //pushes an object with name, type and time
                fixedCores.push({name :semester1[i].name, type :"lecture", time : semester1[i].lectureTimes});
                reserveTime(start, end, day);
            }
            else{ // Sends an error if 2 courses have fixed lecture times.
                return false;
            }
            console.log("Fixed lecture " + semester1[i].name);
        }

        else{ // This means the lecture times are flexible.
            if(semester1[i].lectureTimes.length != 0){
                flexCores.push({name :semester1[i].name, type :"lecture", time : semester1[i].lectureTimes});
                console.log("Flexible lecture " + semester1[i].name);
            }
        }
        if (semester1[i].tutorialTimes.length === 1){
            var day = semester1[i].tutorialTimes[0][0].day;
            var start = semester1[i].tutorialTimes[0][0].start;
            var end = semester1[i].tutorialTimes[0][0].end;

            console.log("Fixed tutorial " + semester1[i].name);
            if(times[day].indexOf(start) < 0 && times[day].indexOf(end) < 0){
                //pushes an object with name, type and time
                fixedCores.push({name :semester1[i].name, type :"tutorial", time : semester1[i].tutorialTimes});
                reserveTime(start, end, day);
            }
            else{ // Sends an error if 2 courses have fixed tutorial times.
                return false;
            }
        }

        else { // This means the tutorial times are flexible.
            if(semester1[i].tutorialTimes.length != 0){
                flexCores.push({name :semester1[i].name, type :"tutorial", time : semester1[i].tutorialTimes});
                console.log("Flexible tutorial " + semester1[i].name);
            }

        }

        if (semester1[i].labTimes.length === 1){
            var day = semester1[i].labTimes[0][0].day;
            var start = semester1[i].labTimes[0][0].start;
            var end = semester1[i].labTimes[0][0].end;

            console.log("Fixed lab " + semester1[i].name);
            if(times[day].indexOf(start) < 0 && times[day].indexOf(end) < 0){
                //pushes an object with name, type and time
                fixedCores.push({name :semester1[i].name, type :"lecture", time : semester1[i].lectureTimes});
                reserveTime(start, end, day);
            }
            else{ // Sends an error if 2 courses have fixed lab times.
                return false;
            }
        }

        else{
            if(semester1[i].labTimes.length != 0){
                flexCores.push({name :semester1[i].name, type :"lab", time : semester1[i].labTimes});
                console.log("Flexible Lab " + semester1[i].name);
            }

        }
    }

    doFlexibleCourses();
    return true;

}

function doSemester2() {

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

function doFlexibleCourses() {
    var counter =  fixedCores.length; //Counter contains the number of all  labs, tutorials and lectures.
    for (var i =0 ; i < flexCores.length
        ; i++){
       var time = flexCores[i].time;
       counter += time.length;
       console.log('Time length ' + time.length);
    }

    graph = new jsgraphs.Graph(counter);

        //Labeling nodes for fixed cores.
        for(var i = 0 ; i < fixedCores.length; i++){
            var timeObject = fixedCores[i].time;
            var name = fixedCores[i].name;
            var core = timeObject[0][0].core;
            //Labelling a node
            graph.node(i).label = name + ' ' + core;
        }

        counter = fixedCores.length -1;
        //Labelling nodes for flexible cores

        for(var i=0; i < flexCores.length; i++){
            var timeObject = flexCores[i].time;
            var name = flexCores[i].name;
            console.log("time object length " + timeObject.length);
            for(i=0 ; i < timeObject.length; i++){
                var core = (timeObject[i][0].tutorial);
                graph.node(counter).label = name + ' ' + core;
                counter++;
            }
        }
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

// Reserves the time for a particular day in order to avoid conflicts.
function reserveTime(startTime,endTime,day) {
    for (var i= startTime; i< endTime; i+=0.5){
        times[day].push(i);
    }
}

function sendError(message) {
    //Sends an error page 'scheduleError.ejs' with the appropriate 'message'
    router.post('/generate',function (req, res, next) {
    });
}

Array.prototype.multiIndexOf = function (el) {
    var idxs = [];
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] === el) {
            idxs.unshift(i);
        }
    }
    return idxs;
};

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