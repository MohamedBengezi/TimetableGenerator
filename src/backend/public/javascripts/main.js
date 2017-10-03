
$('#output').innerHTML = "<p>Hello</p>";
$(document).ready(function () {
    var allCourses = [];
    $('#add').click(function () {
        var value = $('#input').val();
        if (value === ''){
            $('#error').html("Please enter a course code");
            $('#error').effect('shake');
        }
        else{
            $('#error').html(" ");
            $.ajax({
                url: '/check/' + value,
                type:"POST"
            }).done(function (result) {
                if (result === "added"){
                    $("#error").html("You already chose this course");
                    return;
                }
                if (result === "error"){
                    $("#error").html("Invalid course");
                    $('#error').effect('shake');
                    return;
                }
                console.log('done ' + result);
                $('#output').html(result);
            });
        }

    });


    $.ajax({
        url:'/getlink',
        type:"POST"
    }).done(function (result) {
        console.log(result);
        $("#input").autocomplete({ maxShowItems:10,source:result, minLength:4, delay:0});
    });

    $("#generate").click(function () {
        console.log("clicked generate ");

       $.ajax({
            url: '/check/submit',
            type: "POST"
        }).done(function () {
            $.ajax({
                url: '/generateTimeTable',
                type: "POST"
            });
        });

    });

});


