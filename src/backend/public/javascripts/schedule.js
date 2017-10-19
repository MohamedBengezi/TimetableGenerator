$(document).ready(function () {

    $.ajax({
        url:'/generateTimeTable/getSchedule',
        type:"GET"
    }).done(function (result) {
        putCourses(result)
    });
    var colors=[];
    var courses=[];
    function randomColor() {
        var back = ["#a0c4ff","#ffa0ff","#ffa0a0","#c6c4c4","#fff8ba","#a7f99f","#bafff8","#bebaff","#ffca96"];
        return back[Math.floor(Math.random() * back.length)];
    }
    function putCourses(schedule) {
        var counter = 1;
        schedule.forEach(function (version) {
            version.forEach(function (day) {
                day.forEach(function (core) {
                    var startTime = core.start+'';
                    startTime = startTime.replace('.','');
                    var endTime= core.end;
                    var rowspan = Math.round((core.end-core.start+0.3)/0.5);
                    var day = core.day-1;


                    var name = core.name;
                    var code = core.name.split(' ');
                    code= code[0];
                    var color;
                    if (courses.indexOf(code) < 0){
                        //make a randomColor;

                        color = randomColor();
                        while(colors.indexOf(color) >=0 ){
                            color = randomColor();
                        }
                        colors.push(color);
                        courses.push(code);
                    }
                    else{
                        var index = courses.indexOf(code);
                        color= colors[index];
                    }
                    var cell = $("#schedule"+counter+' .time'+startTime + " .day" +day);


                    for(var start= core.start+0.5; start <= endTime; start += 0.5){
                        var temp = start+'';
                        temp = temp.replace('.','');
                        $("#schedule"+counter+' .time'+temp + " .day" +day).remove();
                    }
                    cell.attr('rowspan',rowspan);
                   cell.html(name+'<br>'+core.room+'<br>'+core.supervisor);
                   cell.css('background',color);
                })
            });
            counter++;
        });
     //   $("#schedule"+1+' .time'+15 + " .day" +0).remove();
    }
});