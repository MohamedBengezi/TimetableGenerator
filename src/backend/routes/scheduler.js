var express = require('express');
var jsgraphs = require('js-graph-algorithms');

var graph; //Graph where each node represents a core and edge represents non-conflict relationship.
var router = express.Router();
var dataset;
var allCourses;
var finalCourses; // The courses user wants to generate time table on.

//dataset.timetables[2017][6].courses
//var fullYear = []; // Contains course objects of courses that are available only for full year (September - March).
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
var schedule2=[];
router.get('/',function (req, res, next) {
    schedule=[];
    times=[];
    day1=[];
    day2=[];
    day3=[];
    day4=[];
    day5=[];
    day6=[];

    semester1 = [];
    semester2 = [];
 //   fullYear = [];
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

    console.log("Final Courses --" + finalCourses);
    var errorCheck;
    errorCheck = algorithm();
    console.log("Error check Value : ---- " + errorCheck);


  if (errorCheck === false){
        console.log("There is an error");
      return res.render('scheduleError',{conflicts: conflictCourses});

    }else{
      schedule= [];
      schedule2=[];
      console.log("There is no error \n \n");
      var version = finalSemester1[0];
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

          version = finalSemester2[0];
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


      console.log(schedule2);

  //    express.locals.schedule= schedule;

      return res.render('schedule',{schedule: schedule});
    }
});

router.get('/getSchedule',function (req,res,next) {
    res.send(schedule);
    res.end;
});

function algorithm() {


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
           else{
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
       success = doSemester(semester1);
       var success2 = doSemester(semester2);

       if(!success || !success2){
           console.log("Redoing it " + success + ' ' + success2);
           if(!success || !success2){
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

function permutation(number) {
    var prod =1;
    for(var i =2; i <= number; i++){
        prod = prod * i;
    }
    return prod;
}

function updateSemester(semster) {
    var temp=[];
    semster.forEach(function (t) {
        temp.push(t);
    });
    return temp;
}
var madeArrays=[];
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

function getConflicts(startTime,endTime,day) {
    for (var i= startTime; i<= endTime; i+=0.5){
        if(times[day].indexOf(i) >= 0){
            return true;}
    }
    return false;
}

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


var conflictCourses = [];
function doSemester(semester1) {
    for(var i =0; i < 7; i++){ // Initializing all the arrays within time.
        times[i] = [];
    }
    fixedCores=[];
    flexCores=[];
    semester1 = prioritize(semester1);
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
                semester1.forEach(function (core) {
                    if(getConflicts(start,end,day) && conflictCourses.indexOf(core.name) < 0){
                        conflictCourses.push(core.name);
                    }
                });
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

    return makeGraph();

}

var conflictAvoider = []; //Each index represents the times of a course.

var allTimeObjects = []; // Contains the time objects of all Cores. The value of each index is same as the node id in graph.
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
          timeTables.forEach(function (timeTable) {
              var version = [];
              timeTable.forEach(function (core) {
                  version.push(allTimeObjects[core]);
              });
              finalSemester1.push(version);
          });
      }
      else{
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
function hasConflict(startTime,endTime,day,courseId) {
    for (var i= startTime; i<= endTime; i+=0.5){
        if(conflictAvoider[courseId][day].indexOf(i) >= 0){
            return true;
        }
    }
    return false;
}

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
   // fullYear = [];
    bothSemesters = [];
    semester1 = [];
    semester2 = [];
    finalSemester1 = [];
    finalSemester2 = [];
};