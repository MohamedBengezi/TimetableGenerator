var express = require('express');
var jsgraphs = require('js-graph-algorithms');

var graph; //Graph where each node represents a core and edge represents non-conflict relationship.
var router = express.Router();
var dataset;
var allCourses;
var finalCourses; // The courses user wants to generate time table on.

//dataset.timetables[2017][6].courses
var fullYear = []; // Contains course objects of courses that are available only for full year (September - March).
var bothSemesters = []; //Contains course objects of courses that are available for both Semesters. Example Macro Economics ECON 1BB3
var semester1 = []; // Contains course objects of courses that are available only for first Semesters.
var semester2 = []; //Contains course objects of courses that are available only for second Semesters.

var fixedCores = []; //Array of fixed cores for labs, lectures and tutorials
var flexCores = []; //Array of flexible cores for labs, lectures and tutorials.
var finalSemester1 = []; //Array of time objects for final schedule for first semester 1.
var finalSemester2 =[]; //Array of time objects for final schedule for second semester 2.

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

var schedule=[];
router.get('/',function (req, res, next) {
    semester1 = [];
    semester2 = [];
    fullYear = [];
    bothSemesters = [];
    fixedCores=[];
    flexCores=[];
    finalSemester1=[];
    finalSemester2=[];

    console.log("THESE ARE THE FINAL COURSES \n" );

    dataset = require('../app.js').dataset; //An Array of 'Course' objects that contains detailed information about a course.
    allCourses  = require('../app.js').macCourses; // Object of the data set that contains detailed information about a course.


    var checkCourse = require('./checkCourse');
    finalCourses  = checkCourse.finalCourses;

    var errorCheck;
    errorCheck = algorithm();
    console.log("Error check Value : ---- " + errorCheck);


  if (errorCheck === false){
        console.log("There is an error");
      return res.render('scheduleError');

    }else{
      schedule= [];
      console.log("There is no error");
      finalSemester1.forEach(function (version) {
          version.forEach(function (core) {
              core.forEach(function (timeObj) {
                  putInaDay(timeObj.day, timeObj);
              });
          });
          var temp =[day1,day2,day3,day4,day5,day6];
          schedule.push(temp);
          day1=[];
          day2=[];
          day3=[];
          day4=[];
          day5=[];
          day6=[];
      });

  //    express.locals.schedule= schedule;

      return res.render('schedule',{schedule: schedule});
    }
});

router.get('/getSchedule',function (req,res,next) {
    res.send(schedule);
    res.end;
});

function algorithm() {
    for(var i =0; i < 7; i++){ // Initializing all the arrays within time.
        times[i] = [];
    }

    for ( var i = 0; i < finalCourses.length; i++){
        var indicies = allCourses.multiIndexOf(finalCourses[i]);
        console.log("Course Name : " +finalCourses[i].name);
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

}


function doSemester1() {
    console.log("\n --- SEMESTER 1 --- \n");
    console.log(semester1.length + "\n");
    // Finds the lecture times, tutorial times and lab times that are fixed and flexible.
    for (var i=0; i < semester1.length; i++){

        if (semester1[i].lectureTimes.length === 1){
            var day = semester1[i].lectureTimes[0][0].day;
            var start = semester1[i].lectureTimes[0][0].start;
            var end = semester1[i].lectureTimes[0][0].end;

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
                fixedCores.push({name :semester1[i].name, type :"lab", time : semester1[i].labTimes});
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
    if(fixedCores.length === 0){
        fixedCores.push({name :"fake", type :"fake", time : [[{day:10,start:20,end:20,core:'fake',room:'fake',name:'fake'}]]}) //Fake core with no times.
    }

    makeGraph();
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

var conflictAvoider = []; //Each index represents the times of a course.

var allTimeObjects = []; // Contains the time objects of all Cores. The value of each index is same as the node id in graph.
function makeGraph() {
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
            var name = fixedCores[i].name;
            var core = timeObject[0][0].core;
            //Labelling a node
            graph.node(i).label = name;
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
            for(j=0 ; j < timeObject.length; j++){
                allTimeObjects.push(timeObject[j]);

                graph.node(counter).label = name;
                conflictAvoider[counter] = [];
                counter++;
            }
        }

    //Reserving time for fixed cores

    for(var i =0 ; i < conflictAvoider.length; i++){
            for (var eachDay=0; eachDay < 7; eachDay++){
                conflictAvoider[i][eachDay]= [];
            }
            if (i<fixedCores.length){
                for (var j=0; j < fixedCores[i].time.length; j++){
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
      counter = connectedCompontents.length;
      if(fixedCores[0].time[0][0].core === "fake" && counter === 0){
          counter = 1;
      }
      connectedCompontents = getConnectedComponent(graph);
      console.log('\n \n');
      console.log('Doing it for next core');
      console.log('For loop for --- ' + graph.node(flexCourseId).label);
      for(var core =0; core < course.time.length; core++){
          var ignore = false;
          for(var eachDay= 0; eachDay < course.time[core].length; eachDay++){
              var day  = course.time[core][eachDay].day;
              var start = course.time[core][eachDay].start;
              var end = course.time[core][eachDay].end;

              for(var i =0; i< connectedCompontents.length; i++){
                  if(i < fixedCores.length){ //Need this in-order for program to work when user enters only one course.
                      var courseId = connectedCompontents[i]; // Takes care of the flexible cores that conflicts with FIXED cores.
                      if(conflictAvoider[courseId][day].indexOf(start) >= 0 && conflictAvoider[courseId][day].indexOf(end) >= 0){
                          ignore = true;
                          break;
                      }
                  }
              }
              if (ignore){ break;}
          }

          if (! ignore){
              console.log('---connected componenets--' + connectedCompontents);
              if(connectedCompontents.length > fixedCores.length ){
                  for(var eachDay= 0; eachDay < course.time[core].length; eachDay++) {
                      var day = course.time[core][eachDay].day;
                      var start = course.time[core][eachDay].start;
                      var end = course.time[core][eachDay].end;

                      for(var i =counter; i< connectedCompontents.length; i++){
                          var courseId = connectedCompontents[i]; // Takes care of the flexible cores that conflicts with FIXED cores.
                          if(conflictAvoider[courseId][day].indexOf(start) < 0 && conflictAvoider[courseId][day].indexOf(end) < 0){
                              console.log("\n Edge between " + graph.node(courseId).label + " and " + graph.node(flexCourseId).label);
                              graph.addEdge(courseId,flexCourseId);
                              avoidConflicts(start,end,day,flexCourseId);
                          }
                      }
                  }
              }
              else{
                      graph.addEdge(fixedCores.length-1, flexCourseId);
                      avoidConflicts(start,end,day,flexCourseId);
              }
          }
          if(index === (flexCores.length - 1)){
              console.log('pushing ' +graph.node(flexCourseId).label);
              nodeIds.push(flexCourseId);
          }
          flexCourseId++;
      }
        index++;

    }
  if(flexCores.length > 1 ){
      var timeTables = [];
      BreadthFirstPaths(graph,0);

      for(var index = 0; index < nodeIds.length; index++){
          console.log(hasPathTo(index));
          if(hasPathTo(nodeIds[index])){
              var path = pathTo(nodeIds[index]);
              console.log("\n ----- TIMETABLE----- \n");
              if(graph.node(path[path.length-1]).label === "fake fake"){

                  path.splice(path.length-1);
              }
              timeTables.push(path)
              for(var i =0; i < path.length; i++){
                  console.log(graph.node(path[i]).label );
              }

          }
      }



      timeTables.forEach(function (timeTable) {
          var version = [];
          timeTable.forEach(function (core) {
              version.push(allTimeObjects[core]);
          });
          finalSemester1.push(version);
      });

  }
  else{ //If this condition runs, it means that the user has only given fixed cores.
     // fixedCores --> variable that has fixedCores
      fixedCores.forEach(function (core) {
          finalSemester1.push(core.time);
      });
  }

}

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


// Reserves the time for a particular day in order to avoid conflicts.
function reserveTime(startTime,endTime,day) {
    for (var i= startTime; i< endTime; i+=0.5){
        times[day].push(i);
    }
}

function  avoidConflicts(startTime,endTime,day,courseIndex) {
    for (var i= startTime; i< endTime; i+=0.5){
        conflictAvoider[courseIndex][day].push(i);
    }
}

var marked=[];
var edgeTo=[];
var distTO=[];
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
var q =[];
function  bfs(G, s) {
    q=[];
    for (var i = 0; i < G.V; i++) {
        distTO[i] = Infinity;
    }
    distTO[s] = 0;
    marked[s] = true;
    q.push(s);

    while (q.length != 0) {
        var v = q.pop();
        G.adj(v).forEach(function (w) {
            if (!marked[w]) {
                edgeTo[w]=(v);
                distTO[w] = distTO[v] + 1;
                marked[w] = true;
                q.push(w);
            }
        })
    }
    return;
}

function hasPathTo(v) {
    return marked[v];
}

function pathTo(v) {
    if(!hasPathTo(v)) return null;
    var path = [];
    var x;

        for(x = v; distTO[x] != 0 ; x= edgeTo[x]){
            path.push(x);
        }
        path.push(x);



    return path;
}


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