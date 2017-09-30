var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');


var index = require('./routes/index');
var users = require('./routes/users');
var checkCourse = require('./routes/checkCourse');

var app = express();

var realData = null;

request('https://www.timetablegenerator.io/api/v2/school/mcmaster', function (error, response, body) {
  if (error){
    console.log('\n Something went wrong');
  }
  else{
    realData = JSON.parse(body);
    startProgram()
  }
})

var courseIDs = [];
function startProgram() {
    app.locals.dataSet  =realData;

    for(var key in realData.timetables[2017][6].courses){

        try{
            var deptandCourse = realData.timetables[2017][6].courses[key].code.split(' ');
            var courseName = deptandCourse[0] + '-'+ deptandCourse[1];
            courseIDs.push(courseName);
        }

        catch (Excpetion){
            console.log("DataSet Error -- beans -- ");
            console.log(Excpetion);
        }
    }

    for (var key in realData.timetables[2017][13].courses){

        try{
            var deptandCourse = realData.timetables[2017][13].courses[key].code.split(' ');
            var courseName = deptandCourse[0] + '-'+ deptandCourse[1];
            courseIDs.push(courseName);
        }

        catch (Excpetion){
            console.log("DataSet Error -- beans -- ");
            console.log(Excpetion);
        }
    }
    app.locals.courseids = courseIDs;
    module.exports.macCourses = courseIDs;
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
app.use('/users', users);
app.use('/check',checkCourse);
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


