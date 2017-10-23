var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');
var Course = require('./routes/Course');
var fs = require('fs');
var index = require('./routes/index');
var checkCourse = require('./routes/checkCourse');
var scheduler  = require('./routes/scheduler');
var app = express();

var realData = null;
/*

fs.readFile("C://Users//amitb//Desktop/data.txt", 'utf8', function(err, contents) {

    realData = JSON.parse(contents);
    startProgram();
});
*/
request('https://www.timetablegenerator.io/api/v2/school/mcmaster/', function (error, response, body) {
    console.log(error);
  if (error){
    console.log('\n Something went wrong');
  }
  else{
    realData = JSON.parse(body);
    console.log("Starting the program");
    startProgram();
  }
});

var courseIDs = []; //Custom made course ids to show the available courses to user.

var allCourses = [] //Array containing 'Course' objects which represents all courses.
                    //Multiple entries of same course will be there if the course is offered in multiple semesters.
function startProgram() {
    app.locals.dataSet  =realData;
    for(var key in realData.timetables[2017][6].courses){

        try{
            var deptandCourse = realData.timetables[2017][6].courses[key].code.split(' ');
            var courseName = deptandCourse[0] + '-'+ deptandCourse[1];
            var lectureTimes = [];
            var tutorialTimes = [];
            var labTimes = [];
            var term = realData.timetables[2017][6].courses[key].term;
            //  console.log("Term -- " + term);
            for (var time in realData.timetables[2017][6].courses[key].sections){


                switch (time){
                    case "C":
                        // Code for getting lecture times for all cores.
                        for (var eachCore in realData.timetables[2017][6].courses[key].sections.C){ // runs for C01, C02, C03 ...
                            var oneCore = []; // Contains Specific info about each Core
                            for (var eachTime in realData.timetables[2017][6].courses[key].sections.C[eachCore].r_periods){ //runs to find times for each Cores
                                var startTime = realData.timetables[2017][6].courses[key].sections.C[eachCore].r_periods[eachTime].start + "";
                                var endTime = realData.timetables[2017][6].courses[key].sections.C[eachCore].r_periods[eachTime].end + "";
                                if (startTime == 'undefined' || endTime == 'undefined'){
                                    continue;
                                }
                                startTime = startTime.replace(':','.');
                                if(startTime.charAt('3') == '3'){
                                    startTime = startTime.replace('.3','.5');
                                }
                                endTime = endTime.replace(':','.');
                                if (endTime.charAt('3') == '3'){
                                    endTime = endTime.replace('.3','.5');
                                }
                                var timeObject = {
                                    day : Number(realData.timetables[2017][6].courses[key].sections.C[eachCore].r_periods[eachTime].day),
                                    start: Number(startTime),
                                    end : Number(endTime),
                                    core: eachCore,
                                    room: realData.timetables[2017][6].courses[key].sections.C[eachCore].r_periods[eachTime].room,
                                    name:courseName + ' ' + eachCore,
                                    supervisor:realData.timetables[2017][6].courses[key].sections.C[eachCore].r_periods[eachTime].supervisors[0]
                                };
                                oneCore.push(timeObject);
                            }
                            if(oneCore.length !== 0){
                                lectureTimes.push(oneCore);
                            }

                        }

                        break;
                    case "L":
                        // Code for getting lab times for all labs.

                        for (var eachLab in realData.timetables[2017][6].courses[key].sections.L){ // Runs for each Labs L01, L02 etc
                            var oneLab = []; // Contains Specific info about each Lab
                            for (var eachTime in realData.timetables[2017][6].courses[key].sections.L[eachLab].r_periods){ // gets days and times for each Labs L01
                                var startTime = realData.timetables[2017][6].courses[key].sections.L[eachLab].r_periods[eachTime].start + "";
                                var endTime = realData.timetables[2017][6].courses[key].sections.L[eachLab].r_periods[eachTime].end + "";
                                if (startTime == 'undefined' || endTime == 'undefined'){
                                    continue;
                                }
                                startTime = startTime.replace(':','.');
                                if(startTime.charAt('3') == '3'){
                                    startTime = startTime.replace('.3','.5');
                                }
                                endTime = endTime.replace(':','.');
                                if (endTime.charAt('3') == '3'){
                                    endTime = endTime.replace('.3','.5');
                                }

                                var timeObject = {
                                    day : Number(realData.timetables[2017][6].courses[key].sections.L[eachLab].r_periods[eachTime].day),
                                    start: Number(startTime),
                                    end : Number(endTime),
                                    lab: eachLab,
                                    room: realData.timetables[2017][6].courses[key].sections.L[eachLab].r_periods[eachTime].room,
                                    name:courseName + " " + eachLab,
                                    supervisor:realData.timetables[2017][6].courses[key].sections.L[eachLab].r_periods[eachTime].supervisors[0]
                                };
                                oneLab.push(timeObject);
                            }
                            if(oneLab .length > 0){
                                labTimes.push(oneLab);
                            }
                            else{
                                console.log("Undefined lab for " + key);
                            }

                        }

                        break;
                    case "T":
                        //Code for getting tutorial times for all tutorials.
                        for (var eachTutorial in realData.timetables[2017][6].courses[key].sections.T){ // Runs for each tutorials T01, T02 etc
                            var oneTutorial = []; // Contains Specific info about each Tutorial
                            for (var eachTime in realData.timetables[2017][6].courses[key].sections.T[eachTutorial].r_periods){ // gets days and times for each tutorials T01
                                var startTime = realData.timetables[2017][6].courses[key].sections.T[eachTutorial].r_periods[eachTime].start + "";
                                var endTime = realData.timetables[2017][6].courses[key].sections.T[eachTutorial].r_periods[eachTime].end + "";
                                if (startTime == 'undefined' || endTime == 'undefined'){
                                    continue;
                                }
                                startTime = startTime.replace(':','.');
                                if(startTime.charAt('3') == '3'){
                                    startTime = startTime.replace('.3','.5');
                                }
                                endTime = endTime.replace(':','.');
                                if (endTime.charAt('3') == '3'){
                                    endTime = endTime.replace('.3','.5');
                                }

                                var timeObject = {
                                    day : Number(realData.timetables[2017][6].courses[key].sections.T[eachTutorial].r_periods[eachTime].day),
                                    start: Number(startTime),
                                    end : Number(endTime),
                                    tutorial: eachTutorial,
                                    room: realData.timetables[2017][6].courses[key].sections.T[eachTutorial].r_periods[eachTime].room,
                                    name:courseName + ' ' + eachTutorial,
                                    supervisor:realData.timetables[2017][6].courses[key].sections.T[eachTutorial].r_periods[eachTime].supervisors[0]
                                };
                                oneTutorial.push(timeObject);
                            }
                            if(oneTutorial.length !== 0){
                                tutorialTimes.push(oneTutorial);
                            }

                        }
                        break;
                }
            }
            allCourses.push(new Course.macCourse(courseName,lectureTimes,tutorialTimes,labTimes,term));
            courseIDs.push(courseName);
        }

        catch (Excpetion){
            console.log("DataSet Error -- beans -- ");
            console.log(Excpetion);
        }
    }


    app.locals.courseids = courseIDs;
    module.exports.macCourses = courseIDs;
    module.exports.dataset = allCourses;
    console.log("Total allcourses length ---" + allCourses.length);
    console.log('\n OPEN http://localhost:3000/ IN YOUR BROWSER');
}
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/check',checkCourse);
app.use('/generateTimeTable', scheduler);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app ;


