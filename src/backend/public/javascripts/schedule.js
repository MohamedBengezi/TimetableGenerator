$(document).ready(function () {

    $.ajax({
        url:'/generateTimeTable/getSchedule',
        type:"GET"
    }).done(function (result) {
        putCourses(result)
    });

    function putCourses(schedule) {
        var counter = 1;
        console.log(schedule);
        schedule.forEach(function (version) {
            version.forEach(function (day) {
                day.forEach(function (core) {
                    var startTime = core.start+'';
                    startTime = startTime.replace('.','');
                    var endTime= core.end;
                    var rowspan = Math.round((core.end-core.start)/0.5);

                    var day = core.day-1;

                    if(day===5){
                        day= 4;
                    }
                    var name = core.name;
                    if(name == "MATH-2Z03 T03"){
                        console.log(day);
                    }
                    var cell = $("#schedule"+counter+' .time'+startTime + " .day" +day);
                    var cell2 = $("#schedule"+counter+' .time'+endTime + " .day" +day);
                    console.log(rowspan);
                    cell.attr('rowspan',++rowspan);
                    cell2.attr('rowspan',++rowspan)
                   cell.html(name);
                })
            });
            counter++;
        })
    }
});