var express = require('express');
var router = express.Router();
var assert = require('assert');
var checkCourse = require('../routes/checkCourse');
const superagent = require("superagent");

var times = [];

function reset() {
    for(var i = 0 ; i < 6; i++){
        times[i] = [];
    }
}

function reserveTime(startTime,endTime,day) {
    for (var i= startTime; i< endTime; i+=0.5){
        times[day].push(i);
    }
}

function getConflicts(startTime,endTime,day) {
    for (var i= startTime; i<= endTime; i+=0.5){
        if(times[day].indexOf(i) >= 0){
            return true;}
    }
    return false;
}

console.log("\n Running Output test 1 \n");courses = ['ENGINEER-1C03', 'MATH-1ZC3', 'MATH-1ZB3', 'ECON-1BB3', 'PHYSICS-1E03', 'MATLS-1M03'];
var isThereConflict5 = true;

checkCourse.updateSelectedCourses(courses);


describe('Output Test 1', function() {
    describe("'ENGINEER-1C03', 'MATH-1ZC3', 'MATH-1ZB3', 'ECON-1BB3', 'PHYSICS-1E03', 'MATLS-1M03'", function() {
        it('boolean value should be false, which means there arent any conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            isThereConflict5 = false
                                        }
                                        else{ // There was a conflict
                                            isThereConflict5 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(isThereConflict5,false, "Schedule Completed");
                        })
                })


        });
    });
});


console.log("\n Running Output test 2 \n");
courses = ['SFWRENG-3XA3', 'SFWRENG-3BB4', 'SFWRENG-3DB3', 'SFWRENG-3MX3', 'COMMERCE-1AA3'];
var isThereConflict2 = true;
checkCourse.updateSelectedCourses(courses);

describe('Output Test 2', function() {
    describe('SFWRENG-3XA3, SFWRENG-3BB4, SFWRENG-3DB3, SFWRENG-3MX3, COMMERCE-1AA3', function() {
        it('boolean value should be false, which means there arent any conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            isThereConflict2 = false
                                        }
                                        else{ // There was a conflict
                                            isThereConflict2 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(isThereConflict2,false, "Schedule Completed");
                        })
                })


        });
    });
});

console.log("\n Running Output Test 3 \n");
var courses = ['RELIGST-2TA3', 'RELIGST-2QQ3', 'POLSCI-2I03', 'POLSCI-4CA3'];
var isThereConflict3 = true;

checkCourse.updateSelectedCourses(courses);


describe('Output Test 3', function() {
    describe("'RELIGST-2TA3', 'RELIGST-2QQ3', 'POLSCI-2I03', 'POLSCI-4CA3'", function() {
        it('boolean value should be false, which means there arent any conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            isThereConflict3 = false
                                        }
                                        else{ // There was a conflict
                                            isThereConflict3 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(isThereConflict3,false, "Schedule Completed");
                        })
                })


        });
    });
});


console.log("\n Running Output test 4 \n");
var courses = courses = ['EARTHSC-2EI3', 'EARTHSC-2C03', 'GEOG-2UI3', 'GEOG-2GI3', 'BIOLOGY-2F03'];
var isThereConflict4 = true;

checkCourse.updateSelectedCourses(courses);


describe('Output Test 4', function() {
    describe("'EARTHSC-2EI3', 'EARTHSC-2C03', 'GEOG-2UI3', 'GEOG-2GI3', 'BIOLOGY-2F03'", function() {
        it('boolean value should be false, which means there arent any conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            isThereConflict4 = false
                                        }
                                        else{ // There was a conflict
                                            isThereConflict4 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(isThereConflict4,false, "Schedule Completed");
                        })
                })


        });
    });
});



console.log("\n Running Conflict Test 1 \n");
var courses = ['SFWRENG-3RA3', 'EARTHSC-2EI3'];
var conflictTest1 = false;

checkCourse.updateSelectedCourses(courses);


describe('Conflict Test 1', function() {
    describe("'SFWRENG-3RA3', 'EARTHSC-2EI3'", function() {
        it('boolean value should be true, which means there are conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            conflictTest1 = false
                                        }
                                        else{ // There was a conflict
                                            conflictTest1 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(conflictTest1,true, "Schedule Completed");
                        })
                })


        });
    });
});

console.log("\n Running Conflict Test 2 \n");
var courses = ['RELIGST-2TA3', 'SFWRENG-3BB4'];
var conflictTest2 = false;

checkCourse.updateSelectedCourses(courses);

describe('Conflict Test 2', function() {
    describe("RELIGST-2TA3, SFWRENG 3BB4", function() {
        it('boolean value should be true, which means there are conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            conflictTest2 = false
                                        }
                                        else{ // There was a conflict
                                            conflictTest2 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(conflictTest2,true, "Schedule Completed");
                        })
                })


        });
    });
});

console.log("\n Running Conflict Test 3 \n");
var courses = ['BIOLOGY-2F03', 'SFWRENG-3MX3'];
var conflictTest3 = false;

checkCourse.updateSelectedCourses(courses);

describe('Conflict Test 3', function() {
    describe("'BIOLOGY-2F03', 'SFWRENG-3MX3'", function() {
        it('boolean value should be true, which means there are conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            conflictTest3 = false
                                        }
                                        else{ // There was a conflict
                                            conflictTest3 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(conflictTest3,true, "Schedule Completed");
                        })
                })


        });
    });
});

console.log("\n Running Conflict Test 3 \n");
var courses = ['MATLS-2B03', 'EARTHSC-2EI3'];
var conflictTest4 = false;

checkCourse.updateSelectedCourses(courses);

describe('Conflict Test 4', function() {
    describe("'MATLS-2B03', 'EARTHSC-2EI3'", function() {
        it('boolean value should be true, which means there are conflicts', function() {

            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            conflictTest4 = false
                                        }
                                        else{ // There was a conflict
                                            conflictTest4 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(conflictTest4,true, "Schedule Completed");
                        })
                })


        });
    });
});


console.log("\n Robustness Test \n");
var courses = ['PHYSICS-1E03','ENGINEER-1P03','PHYSICS-1D03','CHEM-1E03','MATH-1ZA3','MATH-1ZC3','MATH-1ZB3','MATLS-1M03','ENGINEER-1C03','ENGINEER-1D04','ECON-1BB3','ECON-1B03'];
var isThereConflict1 = false;
checkCourse.updateSelectedCourses(courses);

describe('Robustness Test ', function() {
    describe("'PHYSICS-1E03','ENGINEER-1P03','PHYSICS-1D03','CHEM-1E03','MATH-1ZA3','MATH-1ZC3','MATH-1ZB3','MATLS-1M03','ENGINEER-1C03','ENGINEER-1D04','ECON-1BB3','ECON-1B03'", function() {
        it('boolean value should be false, which means there arent any conflicts', function() {
            superagent
                .get('http://localhost:3000/generateTimeTable')
                .end(function (res) {
                    superagent
                        .get('http://localhost:3000/generateTimeTable/getSchedule')
                        .end(function (res) {
                            // console.log(body);
                            var courses = JSON.parse(body);
                            console.log(courses[0][0][0].name + " " + courses[0][0][0].start + " " +courses[0][0][0].end);
                            console.log(courses[0][0][0]);

                            var breaking = false;
                            for (var i =0 ; i < 2 ; i++){
                                if(breaking === true){
                                    break;
                                }
                                for (var j = 0; j < courses[i].length; j++){
                                    if (breaking === true){
                                        break;
                                    }
                                    for (var k =0; k < courses[i][j].length; k++){
                                        var day = courses[i][j][k].day;
                                        var start = courses[i][j][k].start;
                                        var end = courses[i][j][k].end;
                                        if(getConflicts(start,end,day) === false){ // There is no conflict
                                            reserveTime(start,end,day);
                                            isThereConflict1 = false
                                        }
                                        else{ // There was a conflict
                                            isThereConflict1 = true;
                                            breaking = true;
                                            break
                                        }
                                    }
                                }
                                reset();

                            }
                            assert.equal(isThereConflict1,false, "Schedule Completed");

                        });

                });

        });
    });
});
module.exports = router;