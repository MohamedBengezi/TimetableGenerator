var express = require('express');
var jsgraphs = require('js-graph-algorithms');
const Graph = require('node-all-paths');
/**
 *
 */
var graph; //Graph where each node represents a core and edge represents non-conflict relationship.
var g1; // Graph for semester 1
var g2; // Graph for semester 2
var nodeIDS;// nodeIDS of cores at the end of the graphs
var timObj1; // Array of time objects of all the courses in semester 1
var timObj2; // Array of time objects of all the courses in semester 2

var router = express.Router();
var dataset;
var allCourses;
var finalCourses; // The courses user wants to generate time table on.
/**
 * @type {Array}
 */
var sem1AllPaths = []; //All possible schedules of semester 1
/**
 * @type {Array}
 */
var sem2AllPaths = []; // All possible schedules of semester 2
//var fullYear = []; // Contains course objects of courses that are available only for full year (September - March).
/**
 * @type {Array}
 */
var bothSemesters = []; //Contains course objects of courses that are available for both Semesters. Example Macro Economics ECON 1BB3
/**
 * @type {Array}
 */
var semester1 = []; // Contains course objects of courses that are available only for first Semesters.
/**
 * @type {Array}
 */
var semester2 = []; //Contains course objects of courses that are available only for second Semesters.

/**
 * @type {Array}
 */
var fixedCores = []; //Array of fixed cores for labs, lectures and tutorials
/**
 * @type {Array}
 */
var flexCores = []; //Array of flexible cores for labs, lectures and tutorials.
/**
 * @type {Array}
 */
var finalSemester1 = []; //Array of time objects for final schedule for first semester 1.
/**
 * @type {Array}  */
var finalSemester2 =[]; //Array of time objects for final schedule for second semester 2.

//Array of course objects for each day.
/**
 * @type {Array}
 */
var day1=[];
/** @type {Array} */
var day2=[];
/** @type {Array} */
var day3=[];
/** @type {Array} */
var day4=[];
/** @type {Array} */
var day5=[];
/** @type {Array} */
var day6=[];

/**
 * @type {Array}
 */
var times = []; //Contains the array of times a lecture, lab or tutorial that are reserved.
                // 8.5 is considered as a 8:30, 9.0 is considered as 9:00.
/**
 * @type {boolean}
 */
var success = true;
/**
 * @type {Array}
 */
var schedule=[];
/**
 * @type {Array}
 */
var schedule2=[];
/** @type {Array} */

var paths = []; //Contains different versions of timetable. 1st element is for semester 1 and second is for semester 2.

/**
 * Resets all arrays to empty
 * @function
 */
function reset() {
    schedule=[];
    sem1AllPaths = [];
    sem2AllPaths = [];
    times=[];
    day1=[];
    day2=[];
    day3=[];
    day4=[];
    day5=[];
    day6=[];
    nodeIDS = [];
    semester1 = [];
    semester2 = [];
    //   fullYear = [];
    bothSemesters = [];
    fixedCores=[];
    flexCores=[];
    finalSemester1=[];
    finalSemester2=[];
    conflictCourses = [];

}

/**
 * Route serving index.
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middlewear - Express middlewear.
 */
router.get('/',function (req, res, next) {
    reset();

    dataset = require('../app.js').dataset; //An Array of 'Course' objects that contains detailed information about a course.
    allCourses  = require('../app.js').macCourses; // Object of the data set that contains detailed information about a course.


    var checkCourse = require('./checkCourse');
    finalCourses  = checkCourse.finalCourses;

    console.log("Final Courses --" + finalCourses);
    var errorCheck;
    errorCheck = courseTermClassifier();
    console.log("Error check Value : ---- " + errorCheck);


  if (errorCheck === false){
        console.log("There is an error");

      return res.render('scheduleError',{conflicts: conflictCourses});

    }else{
      schedule= [];
      schedule2=[];
      console.log("There is no error \n \n");
      var version = finalSemester1[0];
      if(version !== undefined){
          version.forEach(function (core) {
              core.forEach(function (timeObj) {
                  putInaDay(timeObj.day, timeObj);
              });
          });
          temp =[day1,day2,day3,day4,day5,day6];
          schedule.push(temp);
      }

          day1=[];
          day2=[];
          day3=[];
          day4=[];
          day5=[];
          day6=[];

          version = finalSemester2[0];
          console.log("UNDEFINED " + version);
          if(version !== undefined){
              version.forEach(function (core) {
                  core.forEach(function (timeObj) {
                      putInaDay(timeObj.day, timeObj);
                  });
              });
              var temp =[day1,day2,day3,day4,day5,day6];
              schedule.push(temp);
          }

          day1=[];
          day2=[];
          day3=[];
          day4=[];
          day5=[];
          day6=[];


      console.log(schedule2);

  //    express.locals.schedule= schedule;


      return res.render('schedule',{schedule: schedule});
    }
});

/**
 * Route serving .
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middlewear - Express middlewear.
 */
router.get('/getSchedule',function (req,res,next) {
    res.send(schedule);
    res.end;
});

/**
 * Route serving
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middlewear - Express middlewear.
 */
router.get('/makeAgain1', function (req,res,next) {

    console.log("Making another one");
    console.log(g1.node(0).label + " is in sem?");
    try{
        if(sem1AllPaths.length === 0){
            paths = [];
            findAllPaths(g1,nodeIDS[0]);
            sem1AllPaths = paths;

        }


        day1=[];
        day2=[];
        day3=[];
        day4=[];
        day5=[];
        day6=[];
        var timetable = [];

        while (timetable.length !== finalSemester1[0].length){
            timetable = sem1AllPaths[Math.floor(Math.random() * sem1AllPaths.length)][0];
        }

        console.log("TIMETABLE");
        console.log(timetable.length + " " + finalSemester1[0].length);

        console.log("Total version1 "+ sem1AllPaths.length);
        var version = [];
        timetable.forEach(function (core) {
            version.push(timObj1[core]);
        });

        if(version !== undefined){
            console.log("VERSION");
            console.log(version);
            version.forEach(function (core) {
                core.forEach(function (timeObj) {
                    putInaDay(timeObj.day, timeObj);
                });
            });
            var temp =[day1,day2,day3,day4,day5,day6];
            schedule[0] = temp;
        }
    }
    catch (E){
        console.log(E);
    }
    res.send(schedule);
});

/**
 * Route serving
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middlewear - Express middlewear.
 */
router.get('/makeAgain2', function (req,res,next) {
    try{
        if(sem2AllPaths.length === 0){
            paths = [];
            findAllPaths(g2,nodeIDS[1]);
            sem2AllPaths = paths;
        }

        day1=[];
        day2=[];
        day3=[];
        day4=[];
        day5=[];
        day6=[];
        console.log("Total versions2 " + sem2AllPaths.length + " " );
        var timetable = sem2AllPaths[Math.floor(Math.random() * sem2AllPaths.length)][0];

        var version = [];
        timetable.forEach(function (core) {
            version.push(timObj2[core]);
        });
        if(version !== undefined){
            console.log("VERSION");
            console.log(version);
            version.forEach(function (core) {
                core.forEach(function (timeObj) {
                    putInaDay(timeObj.day, timeObj);
                });
            });
            var temp =[day1,day2,day3,day4,day5,day6];
            schedule[1] = temp;
        }
    }
    catch (E){
        console.log(E);
    }
    res.send(schedule);
    res.end;
});

/**
 * Route serving
 * @name get/
 * @function
 * @param {string} path - Express path
 * @param {callback} middlewear - Express middlewear.
 */
router.get('/newTable',function (req, res) {
    res.send(
        "        <tbody><tr>\n" +
        "            <th>Time</th>\n" +
        "            <th>Monday</th>\n" +
        "            <th>Tuesday</th>\n" +
        "            <th>Wednesday</th>\n" +
        "            <th>Thursday</th>\n" +
        "            <th>Friday</th>\n" +
        "            <th>Saturday</th>\n" +
        "        </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time8\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    8:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time85\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        8:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time9\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    9:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time95\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        9:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time10\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    10:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time105\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        10:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time11\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    11:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time115\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        11:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time12\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    12:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time125\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        12:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time13\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    13:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time135\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        13:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time14\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    14:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time145\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        14:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time15\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    15:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time155\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        15:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time16\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    16:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time165\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        16:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time17\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    17:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time175\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        17:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time18\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    18:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time185\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        18:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time19\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    19:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time195\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        19:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time20\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    20:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time205\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        20:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time21\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    21:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time215\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                        21:30\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "            <tr class=\"time22\">\n" +
        "                <td style=\"border: 1px solid black; border-collapse: collapse; text-align: center\">\n" +
        "                    \n" +
        "                    22:00\n" +
        "                    \n" +
        "                </td>\n" +
        "                \n" +
        "                <td class=\"day0\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day1\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day2\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day3\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day4\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "                <td class=\"day5\" style=\"text-align:center\"></td>\n" +
        "                \n" +
        "            </tr>\n" +
        "\n" +
        "        \n" +
        "    </tbody>");
    res.end;


});
/**
 * Splits the inputted courses into their respective terms
 * @function
 * @returns {boolean} Returns true if generation is successful
 */

function courseTermClassifier() {


    for ( var i = 0; i < finalCourses.length; i++){
        var indicies = allCourses.multiIndexOf(finalCourses[i]);
        console.log("Course Name : " +finalCourses[i]);
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
           if(term == '6'){
            //   fullYear.push(dataset[indicies[0]]);
               semester1.push(dataset[indicies[0]]);
               semester2.push(dataset[indicies[0]]);
               success = true;
           }
        }
    }

    bothSemesters.forEach(function (course) {

        if(semester1.length < semester2.length){
            console.log(course[0].name + ' term -- ' + course[0].term);
            semester1.push(course[0]);
            if(doSemester((semester1))=== false){
                semester1.splice(semester1.indexOf(course[0]),1);
                semester2.push(course[1]);
                if(doSemester(semester2)===false){
                    return false;
                }
            }
        }
        else{
            semester2.push(course[1]);
            if(doSemester((semester2))=== false){
                semester2.splice(semester2.indexOf(course[1]),1);
                semester1.push(course[0]);
                if(doSemester(semester1)===false){
                    return false;
                }
            }
        }
    });
    console.log("Semester 1 " +semester1);
    console.log("Semester 2 " +semester2);
    console.log("Both Semesters " + bothSemesters);
    try {
        finalSemester1=[];
        finalSemester2=[];
       var success1 = doSemester(semester1);
       var success2 = doSemester(semester2);

        console.log("Hello it " + success1 + ' ' + success2);
       if(!success1 || !success2){
           console.log("Redoing it " + success1 + ' ' + success2);
           if(!success1 || !success2){
               bothSemesters.forEach(function (course) {
                   if(semester1.indexOf(course[0]) >= 0){
                       semester1.splice(semester1.indexOf(course[0]),1);
                   }
                   if(semester2.indexOf(course[1]) >= 0){
                       semester2.splice(semester2.indexOf(course[1]),1);
                   }
               });
               /*         console.log("Before calling both Sem function \n");
                        console.log("Semester 1");
                        semester1.forEach(function (t) {
                            console.log(t.name);
                        });
                        console.log("\n Semester 2");
                        semester2.forEach(function (t) {
                            console.log(t.name);
                        });*/

               var workingBothSemester = dobothSemester(bothSemesters,semester1,semester2);
               console.log("---After--- " + workingBothSemester);

               if(workingBothSemester !== false){

                   workingBothSemester.forEach(function (course) {
                       console.log(course[0].name);
                       if(semester1.length < semester2.length){
                           semester1.push(course[0]);
                       }
                       else{
                           semester2.push(course[1]);
                       }
                   });
                   finalSemester1=[];
                   finalSemester2=[];
                   var suc = doSemester(semester1);
                   var suc2 = doSemester(semester2);
                   console.log("Final results " + suc + " " + suc2);
                   return true;
               }
               else{
                   return false;
               }
           }
       }
    }

    catch (Exception){
        console.log(Exception);
    }
    return success;
}
/**
 * Calculates the permutation of a given number
 * @function
 * @param {int} number - The number for which the permutation is calculated on.
 * @returns {int} prod - The result of the permutation of the input number
 */
function permutation(number) {
    var prod =1;
    for(var i =2; i <= number; i++){
        prod = prod * i;
    }
    return prod;
}

/**
 * Creates a duplicate version of an array.
 * @param {array} semester - The array for which a duplicate version is created.
 * @function
 * @returns {array} temp - The duplicate version of the input array.
 */
function updateSemester(semester) {
    var temp=[];
    semester.forEach(function (t) {
        temp.push(t);
    });
    return temp;
}

/** * @type {Array} */
var madeArrays=[];

/**
 * Puts the all courses offered in both terms into one of the semesters until a conflict-less schedule is found, if it is possible.
 * @function
 * @param {array} bothSemesters - Array of course objects of courses that are offered in both semesters.
 * @param {array} semester1 - Array of course objects of courses that are offered in semester 1.
 * @param {array} semester2 - Array of course objects of courses that are offered in semester 2.
 * @returns {array} randomArray - Array of course objects that are offered in both semesters that can be put in a schedule with no conflicts.
 * @returns {boolean} false - If it is not possible to generate a schedule with courses offered in both Semesters, then it returns false.
 */
function dobothSemester(bothSemesters,semester1,semester2) {
    madeArrays=[];
    var tempor = [];
    for(var z=0; z < bothSemesters.length; z++){
        tempor.push(z);
    }
    madeArrays.push(tempor);
    console.log(" \n Initial")
    bothSemesters.forEach(function (t) {
        console.log(t[0].name);
    });

    var tempSem1 = updateSemester(semester1);
    var tempSem2 = updateSemester(semester2);

    console.log("\n");
    console.log("Redoing it with bothSem length " + bothSemesters.length + " and perm value " + permutation(bothSemesters.length));
    var counter = 1;
    var possiblities = permutation(bothSemesters.length);
    while (counter < possiblities){
        var randomArray = [];
        var arrIndicies = [];
        var value = tempSem1 === semester1;
        console.log("Decoding " + value );
        while (randomArray.length !== bothSemesters.length){ //Creates a brand new Array
            var Index = Math.floor(Math.random() * bothSemesters.length);

            var randomCore = bothSemesters[Index];
            if(randomArray.indexOf(randomCore) < 0){
                console.log("pushing " + randomCore[0].name);
                randomArray.push(randomCore);
                arrIndicies.push(Index);
            }

            if(MadeBefore(madeArrays,arrIndicies) && randomArray.length === bothSemesters.length){
                randomArray = [];
                arrIndicies =[];
            }
            //       console.log("Random Array Length " + randomArray.length);
            if(!MadeBefore(madeArrays,arrIndicies) && randomArray.length === bothSemesters.length){
                // console.log("new Array ");
                //  console.log(arrIndicies);
                ///       break;
            }

        }

        tempSem1 = updateSemester(semester1);
        tempSem2 = updateSemester(semester2);
        if(counter===3){
            console.log("Before Printing tempSem1 values")
            tempSem1.forEach(function (t) {
                console.log(t.name);
            })
        }
        console.log('--Might Not Work --');
        randomArray.forEach(function (course) {
            if(tempSem1.length < tempSem2.length){
                tempSem1.push(course[0]);
            }
            else{
                tempSem2.push(course[1]);
            }
        });
        finalSemester1=[];
        finalSemester2=[];

        if(counter===3){
            console.log("Printing tempSem1 values")
            tempSem1.forEach(function (t) {
                console.log(t.name);
            })
        }
        if(doSemester(tempSem1) && doSemester(tempSem2)){
            console.log("Returning working array");
            return randomArray;
        }
        var temp=[];
        randomArray.forEach(function (core) {
            temp.push(bothSemesters.indexOf(core));
        });
        madeArrays.push(temp);
        console.log("Made Arrays");
        console.log(madeArrays);
        counter++;
    }
    console.log("Made Array's length " + madeArrays.length);
    console.log("Returning Empty Array");
    return false;
}

/**
 * Checks if an array with a different order of elements has been made before.
 * @function
 * @param {array} madeArrays - A 2D array where each element is an array with a different order of integers(e.g: [[0,1,2],[1,0,2]])
 * @param {array} arr - Array of integers that represent the index values of bothSemester array.
 * @return {boolean} based on whether the array has been made before or not.
 */
function MadeBefore(madeArrays,arr) {
    for(var j=0; j< madeArrays.length; j++) {
        var arrayElement = madeArrays[j];
        var different = false;
        for(var i=0; i< arr.length; i++){
            if(arr[i] !== arrayElement[i]){
                different = true;
                break;
            }
        }
        if(different === false){
            return true;
        }
    }
    return false;
}

/**
 * Checks if there is a conflict between the inputted object and others
 * @function
 * @param {number} startTime - Start time of the object
 * @param {number} endTime - End time of the object
 * @param {number} day - Specific day in question
 * @return {boolean} Returns true if there is a conflict
 */
function getConflicts(startTime,endTime,day) {
    for (var i= startTime; i<= endTime; i+=0.5){
        if(times[day].indexOf(i) >= 0){
            return true;}
    }
    return false;
}

/**
 * Prioritizes the courses with most lectures+labs+tutorials.
 * @function
 * @param {array} semester - Array of course objects that has to be rearranged so first element will be the one with highest number of labs+tutorials+lectures.
 * @return {array} result - Array of course objects where the first element will have the highest number of lectures+labs+tutorials and the last element is a course with least number of lectures+labs+tutorials.
 */
function prioritize(semester) {
    var result = [];
    var ranks = [];
    var sorted = [];
    for (var i =0; i < semester.length; i++){
        var rank = semester[i].lectureTimes.length + semester[i].tutorialTimes.length + semester[i].labTimes.length;
        ranks.push(rank);
        sorted.push(rank);
    }
    sorted = sorted.sort(function(a, b){return a-b});
    console.log("Unsorted Ranks " + ranks);
    console.log("Sorted Ranks " + sorted);
    for(var i = sorted.length -1 ; i >= 0 ; i--){
        var index = ranks.indexOf(sorted[i]);
        result.push(semester[index]);
        ranks[index] = 0;
    }
    return result;
}

/** * @type {Array} */
var conflictCourses = [];

/**
 *  Splits the courses in a semester into fixed cores and flexible cores depending on how many cores (L01,L02,L03) are offered by a lecture / tutorial / lab.
 * @function
 * @param {array} semester - An array of course objects of a course in a specific semester.
 * @return {boolean} ans Depending on if a conflict-less schedule was made or not.
 * */
function doSemester(semester) {
    for(var i =0; i < 7; i++){ // Initializing all the arrays within time.
        times[i] = [];
    }
    fixedCores=[];
    flexCores=[];
    semester = prioritize(semester);
    console.log("\n --- SEMESTER 1 --- \n");
    console.log(semester.length + "\n");
    // Finds the lecture times, tutorial times and lab times that are fixed and flexible.
    for (var i=0; i < semester.length; i++){

        if (semester[i].lectureTimes.length === 1){
            var day = semester[i].lectureTimes[0][0].day;
            var start = semester[i].lectureTimes[0][0].start;
            var end = semester[i].lectureTimes[0][0].end;
            console.log(times[day].indexOf(start) + " Smh " + times[day].indexOf(end));
            console.log("Day -- " + day + " Start -- " + start + " End -- " + end);
            if(times[day].indexOf(start) < 0 && times[day].indexOf(end) < 0){
                //pushes an object with name, type and time
                fixedCores.push({name :semester[i].name, type :"lecture", time : semester[i].lectureTimes});
                reserveTime(start, end, day);
            }
            else{ // Sends an error if 2 courses have fixed lecture times.
                semester.forEach(function (core) {
                    if(getConflicts(start,end,day) && conflictCourses.indexOf(core.name) < 0){
                        conflictCourses.push(core.name);
                    }
                });
                console.log("Returning false --431");
                return false;
            }
            console.log("Fixed lecture " + semester[i].name);
        }

        else{ // This means the lecture times are flexible.
            if(semester[i].lectureTimes.length != 0){
                flexCores.push({name :semester[i].name, type :"lecture", time : semester[i].lectureTimes});
                console.log("Flexible lecture " + semester[i].name);
            }
        }
        if (semester[i].tutorialTimes.length === 1){
            var day = semester[i].tutorialTimes[0][0].day;
            var start = semester[i].tutorialTimes[0][0].start;
            var end = semester[i].tutorialTimes[0][0].end;

            console.log("Fixed tutorial " + semester[i].name);
            if(times[day].indexOf(start) < 0 && times[day].indexOf(end) < 0){
                //pushes an object with name, type and time
                fixedCores.push({name :semester[i].name, type :"tutorial", time : semester[i].tutorialTimes});
                reserveTime(start, end, day);
            }
            else{ // Sends an error if 2 courses have fixed tutorial times.
                console.log("Returning false -- 455");
                return false;
            }
        }

        else { // This means the tutorial times are flexible.
            if(semester[i].tutorialTimes.length != 0){
                flexCores.push({name :semester[i].name, type :"tutorial", time : semester[i].tutorialTimes});
                console.log("Flexible tutorial " + semester[i].name);
            }

        }

        if (semester[i].labTimes.length === 1){
            var day = semester[i].labTimes[0][0].day;
            var start = semester[i].labTimes[0][0].start;
            var end = semester[i].labTimes[0][0].end;

            console.log("Fixed lab " + semester[i].name);
            if(times[day].indexOf(start) < 0 && times[day].indexOf(end) < 0){
                //pushes an object with name, type and time
                fixedCores.push({name :semester[i].name, type :"lab", time : semester[i].labTimes});
                reserveTime(start, end, day);
            }
            else{ // Sends an error if 2 courses have fixed lab times.
                console.log("Returning false -- 480");
                return false;
            }
        }

        else{
            if(semester[i].labTimes.length != 0){
                flexCores.push({name :semester[i].name, type :"lab", time : semester[i].labTimes});
                console.log("Flexible Lab " + semester[i].name);
            }

        }
    }
    if(fixedCores.length === 0){
        fixedCores.push({name :"fake", type :"fake", time : [[{day:10,start:20,end:20,core:'fake',room:'fake',name:'fake'}]]}) //Fake core with no times.
    }
    var ans = makeGraph();
    console.log("Making sure -- error (false===yes) ? " + ans);
    return ans;

}

/** * @type {Array} */
var conflictAvoider = []; //Each index represents the times of a course.
/** * @type {Array} */
var allTimeObjects = []; // Contains the time objects of all Cores. The value of each index is same as the node id in graph.
/**
 * Makes the graph
 * @function
 * @return {boolean} true - when done false - if it was not able to make a schedule
 */
function makeGraph() {
    allTimeObjects=[];
    var counter =  fixedCores.length; //Counter contains the number of all  labs, tutorials and lectures.
    console.log("Number of fixed cores " + counter + " -- Number of flexible cores " + flexCores.length);
    for (var i =0 ; i < flexCores.length; i++){
       var time = flexCores[i].time;
       counter += time.length;
    }

    graph = new jsgraphs.Graph(counter);
    console.log("Max number of cores --- " + counter);
        //Labeling nodes for fixed cores.
        for(var i = 0 ; i < fixedCores.length; i++){
            conflictAvoider[i] = [];
            var timeObject = fixedCores[i].time;
            var core = timeObject[0][0].name;
            //Labelling a node
            graph.node(i).label = core;
            timeObject.forEach(function (core) {
                allTimeObjects.push(core);
            });

            if(i < fixedCores.length - 1){
                graph.addEdge(i,i+1); // Adds edges between fixed cores.
            }
        }




        counter = fixedCores.length;
        //Labelling nodes for flexible cores

        for(var i=0; i < flexCores.length; i++){
            var timeObject = flexCores[i].time;
            var name = flexCores[i].name;
            console.log('---- ' + name + ' ----');
            for(j=0 ; j < timeObject.length; j++){
                allTimeObjects.push(timeObject[j]);

                graph.node(counter).label = timeObject[j][0].name;
                conflictAvoider[counter] = [];
                counter++;
            }
        }

    //Reserving time for fixed cores
    console.log("LENGTH --- " + conflictAvoider.length);
    for(var i =0 ; i < conflictAvoider.length; i++){
            for (var eachDay=0; eachDay < 7; eachDay++){
                conflictAvoider[i][eachDay]= [];
            }
            if (i<fixedCores.length){
                for (var j=0; j < fixedCores[i].time[0].length; j++){
                    var day = fixedCores[i].time[0][j].day;
                    var start = fixedCores[i].time[0][j].start;
                    var end = fixedCores[i].time[0][j].end;
                    avoidConflicts(start,end,day,i);
                }
            }
    }



    var flexCourseId = fixedCores.length; //Course Id of flexible cores with respect to graph.

    var index = 0;
    var counter = 0; // index to add edges with new cores.
    var connectedCompontents = getConnectedComponent(graph);
    var nodeIds = []; // Node ids of last flex cores. This is used to
  while(index < flexCores.length ){
      var course = flexCores[index]; //Could be a lecture  or tutorial or lab.
      if(connectedCompontents.length===0){
          counter = 1;
      }
      else{
          counter = connectedCompontents.length;
      }

      console.log('=== counter === ' + counter);
      if(fixedCores[0].time[0][0].core === "fake" && counter === 0){
          counter = 1;
      }
      connectedCompontents = getConnectedComponent(graph);
      console.log('\n \n');
      console.log('Doing it for next core');
      console.log('For loop for --- ' + graph.node(flexCourseId).label);
      for(var core =0; core < course.time.length; core++){
          var ignore = false;

              if(connectedCompontents.length > fixedCores.length ){
                  var ignore2 = false;
                  for(var i =counter; i< connectedCompontents.length; i++){
                      var courseId = connectedCompontents[i];
                      for(var eachDay= 0; eachDay < course.time[core].length; eachDay++) {
                          var day = course.time[core][eachDay].day;
                          var start = course.time[core][eachDay].start;
                          var end = course.time[core][eachDay].end;

                          BreadthFirstPaths(graph,0);
                          if(graph.node(courseId).label === "BIOLOGY-2F03 C01"){
                              console.log("Course is -- BIO 2F03 C01 and " +  course.time[core][eachDay].name);
                              console.log(hasPathConflict(courseId,day,start,end) + " -- \n");
                          }
                          if(hasPathConflict(courseId,day,start,end)){
                        //     console.log(course.time[core][eachDay].name + " won't work with " + graph.node(courseId).label);
                              ignore2 = true;
                              break;
                          }
                      }
                      if(! ignore2){
                          graph.addEdge(courseId,flexCourseId);
                          for(var eachDay= 0; eachDay < course.time[core].length; eachDay++) {
                              var day = course.time[core][eachDay].day;
                              var start = course.time[core][eachDay].start;
                              var end = course.time[core][eachDay].end;
                              avoidConflicts(start,end,day,flexCourseId);
                          }
                      }
                      else{
                          ignore2 = false;
                      }
                  }
              }
              else{
                  for(var eachDay= 0; eachDay < course.time[core].length; eachDay++) {
                      var day = course.time[core][eachDay].day;
                      var start = course.time[core][eachDay].start;
                      var end = course.time[core][eachDay].end;
                      BreadthFirstPaths(graph,0);
                      if(hasPathConflict(fixedCores.length-1,day,start,end)){
                 //         console.log(course.time[core][eachDay].name + " won't work with " + graph.node(fixedCores.length-1).label);
                          ignore = true;
                          break;
                      }
                  }
                  if(! ignore){
                      graph.addEdge(fixedCores.length-1, flexCourseId);
                      for(var eachDay= 0; eachDay < course.time[core].length; eachDay++) {
                          avoidConflicts(course.time[core][eachDay].start,course.time[core][eachDay].end,course.time[core][eachDay].day,flexCourseId);
                      }
                  }
              }

          if(index === (flexCores.length - 1)){
              nodeIds.push(flexCourseId);
          }
          flexCourseId++;
      }
        index++;
    }
  if(flexCores.length > 0 ){
      var timeTables = [];
      BreadthFirstPaths(graph,0);


      for(var index = 0; index < nodeIds.length; index++){
          console.log(hasPathTo(index));
          if(hasPathTo(nodeIds[index])){
              var path = pathTo(nodeIds[index]);
              console.log("\n ----- TIMETABLE----- \n");
              if(graph.node(path[path.length-1]).label === "fake fake"){

                  path.splice(path.length-1,1);
              }
              timeTables.push(path)
              for(var i =0; i < path.length; i++){
                  console.log(graph.node(path[i]).label );
              }
          }
      }
      if(timeTables.length === 0 ){
          return false;
      }
      if(finalSemester1.length === 0){
          nodeIDS[0] = nodeIds;
          g1 = graph;
          timObj1 = allTimeObjects;
          timeTables.forEach(function (timeTable) {
              var version = [];
              timeTable.forEach(function (core) {
                  version.push(allTimeObjects[core]);
              });
              finalSemester1.push(version);
          });
      }
      else{
          nodeIDS[1]= nodeIds;
          g2 = graph;
          timObj2 = allTimeObjects;
          timeTables.forEach(function (timeTable) {
              var version = [];
              timeTable.forEach(function (core) {
                  version.push(allTimeObjects[core]);
              });
              finalSemester2.push(version);
          });
      }

  }
  else{ //If this condition runs, it means that the user has only given fixed cores.
     // fixedCores --> variable that has fixedCores
      if(finalSemester1.length === 0){
          fixedCores.forEach(function (core) {
              finalSemester1.push(core.time);
          });
      }
      else{
          fixedCores.forEach(function (core) {
              finalSemester2.push(core.time);
          });
      }

  }
  return true;
}

/**
 * Gets the connected components
 * @function
 * @param {array} graph - The graph for which the connected components are found.
 * @return {object[]} connectedComp - the connected components
 */
function getConnectedComponent(graph) {
    var cc = new jsgraphs.ConnectedComponents(graph);
    var components = [];
    for (var v = 0; v < graph.V; ++v) {
        components.push(cc.componentId(v));
    }
    var connectedComp = []; // Contains the vertices that have an edge with another course;
    for (var i = 0; i < components.length; i++){
        if(components.multiIndexOf(components[i]).length > 1){
            connectedComp.push(i);
        }
    }
    return connectedComp;
}

/**
 * Reserve the inputted time
 * @function
 * @param {number} startTime - start time of the object
 * @param {number} endTime - end time of the object
 * @param {number} day - day of the object
 */
// Reserves the time for a particular day in order to avoid conflicts.
function reserveTime(startTime,endTime,day) {
    for (var i= startTime; i< endTime; i+=0.5){
        times[day].push(i);
    }
}


/**
 * Puts the times between starting time and ending time of a course at a specific day into an array.
 * @function
 * @param {number} startTime - start time of the object
 * @param {number} endTime - end time of the object
 * @param {number} day - day of the object
 * @param {number} courseIndex - a unique integer that represents a course.
 *
 */
function  avoidConflicts(startTime,endTime,day,courseIndex) {
    for (var i= startTime; i< endTime; i+=0.5){
        conflictAvoider[courseIndex][day].push(i);
    }
}

/**
 * Determines whether this object conflicts with a reserved time
 * @function
 * @param {number} startTime - start time of the object
 * @param {number} endTime - end time of the object
 * @param {number} day - day of the object
 * @param {number} courseId - a unique integer that represents one core.
 * @return {boolean} Whether this object conflicts with a reserved time
 *
 */
function hasConflict(startTime,endTime,day,courseId) {
    for (var i= startTime; i<= endTime; i+=0.5){
        if(conflictAvoider[courseId][day].indexOf(i) >= 0){
            return true;
        }
    }
    return false;
}
/**
*  Checks if a core is having a conflict with any other core that is already in the schedule.
 * @function
 * @param {vertice} coreId - A unique number that represents a specific core.
 * @param {array} day - a number that represents a day of the week.
 * @param {array} start - a number that represents the starting time of a core.
 * @param {array} end - a number that represents the ending time of a core.
* @return {boolean} ans - depending on if the given core has caonflict with any other core in the schedule.
* */
function hasPathConflict(coreId,day, start,end) {
    var path = pathTo(coreId);
  //
    //  console.log("\n \n -- " + graph.node(coreId).label + " -- \n \n");
    path.forEach(function (t) {
    //    console.log(graph.node(t).label);
    });

   // console.log("Path to -- " + graph.node(coreId).label);
    //console.log("\n\n\n\n")
    var s = false;
    path.forEach(function (vertex) {
        if (hasConflict(start, end, day, vertex)) {
            s=true;
        }
    });
    return s;
}

/**
 * @type {Array} array of booleans used to create a graph
 */
var marked=[];
/**
 * @type {Array} array of booleans used to create a graph
 */
var edgeTo=[];
/**
 * @type {Array} array of booleans used to create a graph
 */
var distTO=[];

/**
 * Finds a path in a graph from a starting node.
 * @function
 * @param graph A graph that is used to do the breadth first path
 * @param start The starting node from which the bread first path is done.
 *
 */
function BreadthFirstPaths(graph, start){
    marked=[];
    edgeTo=[];
    distTO=[];
    for(var i =0; i < graph.V; i++){
        marked.push(false);
        edgeTo.push(0);
        distTO.push(0);
    }
    bfs(graph,start);
}

/**
 * Array of integers.
 * @type {Array}
 */
var q =[];

/**
 * This function does the breadth first search from the starting node to a specified ending node.
 * @function
 * @param G The graph for which the bread first search is done.
 * @param s The node value of the node to which the breadth first search is done.
 */
function  bfs(G, s) {
    q=[];
    for (var i = 0; i < G.V; i++) {
        distTO[i] = Infinity;
    }
    distTO[s] = 0;
    marked[s] = true;
    q.push(s);

    while (q.length !== 0) {
        var v = q.pop();
        G.adj(v).forEach(function (w) {
            if (!marked[w]) {
                edgeTo[w] =v;
                distTO[w] = distTO[v] + 1;
                marked[w] = true;
                q.push(w);
            }
        })
    }
}

function hasPathTo(v) {
    return marked[v];
}

function pathTo(v) {

    if(!hasPathTo(v)) return null;
    var path = [];
    var x;
        for(x = v; distTO[x] !== 0 ; x= edgeTo[x]){
            path.push(x);
        }
        path.push(x);
    return path;
}


function findAllPaths(graph, nodeIds) {
    var g = new Graph();
    var hell  =0;

    if(graph.node(0).label === "fake" || graph.node(0).label ==="fake fake"){
     //   hell = 1;
    }
    console.log(nodeIds[0] + ' Node id / ' + graph.V);
    var temp2 = [];

    for (var i =0; i < graph.V ; i++){
        temp2[i] = [];
    }
    for (var i = hell; i < graph.V ; i++){
        temp2[i] =[];
        var edges = graph.adj(i);
        var obj = {};

        edges.forEach(function (vertex) {
            if(temp2[vertex].indexOf(i) < 0){
                temp2[i].push(vertex);
               // var core = graph.node(vertex).label;
                obj[vertex] = 1
            }
        });
        g.addNode(i+"", obj);
    }
    console.log('Making path');
    BreadthFirstPaths(graph, 0);
    nodeIds.forEach(function (t) {
        if(hasPathTo(t)){
            paths.push(g.path('0', t+''));
        }
    });
    console.log("Finished path with length " + paths.length);
}

/**
 * Puts the time object of a course into an array that represents the day at which the course is happening.
 * @function
 * @param {array} courseDay - A number that represents the day of a week in which the course is happening.
 * @param {array} course - The time object of a course.
 */
function putInaDay(courseDay, course){
    switch (courseDay){
        case 1:
            day1.push(course);
            break;

        case 2:
            day2.push(course);
            break;

        case 3:
            day3.push(course);
            break;

        case 4:
            day4.push(course);
            break;

        case 5:
            day5.push(course);
            break;

        case 6:
            day6.push(course);
            break;
    }
}


/**
 * Finds all the indices of same value in an array.
 * @function
 * @param el The value for which the function finds the indices.
 * @returns {Array} Array of numbers that represent the index values of the element el in an array.
 */
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
module.exports.finalCourses = function (arr) {
    finalCourses = arr;
};

/**
 * A function that re-initializes some arrays used in the algorithm.
 */
module.exports.reset = function () { // To reset all the values when the page is reloaded.
    finalCourses = [];
   // fullYear = [];
    bothSemesters = [];
    semester1 = [];
    semester2 = [];
    finalSemester1 = [];
    finalSemester2 = [];
};