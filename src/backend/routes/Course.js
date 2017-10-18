

var course = function (name,lectureTimes,tutorialTimes,labTimes,term) {
    this.name = name;
    this.lectureTimes = lectureTimes;
    this.tutorialTimes = tutorialTimes;
    this.labTimes = labTimes;
    this.term = term;
    this.updateLectureTimes = function () { //Removes the lecture Times from the course object once it is added to the schedule.
       this.lectureTimes = [];
    };
    this.updateTutorialTimes = function () { //Removes the tutorial times from the course object once it is added to the schedule.
        this.tutorialTimes = [];
    };
    this.updateLabTimes = function () { //Removes the lab times from the course object once it is added to the schedule.
        this.labTimes = [];
    };
};

/*
    lectureTimes
        - Each element is an array that contains information about one core.
        - For example, lectureTimes[0] is an array of TimeObjects about C01 of a course.

        TimeObject
            - It is an object with following attributes.
            - day
            - start (8:5 is representing 8:30 am, 13:5 is representing 13:30)
            - end ((8:5 is representing 8:30 am, 13:5 is representing 13:30)
            - tutorial
            - room
            -name
            - supervisor


     labTimes
        - Each element is an array that contains information about one lab.
        - For example, labTimes[0] is an array of TimeObjects about L01 of a course.

        TimeObject
            - It is an object with following attributes.
            - day
            - start
            - end
            - lab
            - room
            - supervisor

 */

// NOTE If a course is being offered in both semesters, then it will be at 2 indicies in CourseIds in app.js / macCourses (exported variable).

module.exports.macCourse = course;