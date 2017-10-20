
window.addEventListener( "pageshow", function ( event ) {
    var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
    if ( historyTraversal ) {
        // Handle page restore.
        console.log("RECALLING");
        $.ajax({
            url: '/check/showCourses',
            type:"GET",
            async: true,
            cache: false
        }).done(function (result) {
            $('#output').html(result);
        });
    }
});
$(document).ready(function () {


    $('#add').click(function () {
        var value = $('#input').val();
        if (value === ''){
            $('#error').html("Please enter a course code");
            $('#input').effect('shake');
        }
        else{
            $('#error').html(" ");
            $.ajax({
                url: '/check/' + value,
                type:"POST"
            }).done(function (result) {
                if (result === "added"){
                    $("#error").html("You already chose this course");
                    $('#input').effect('shake');
                    return;
                }
                if (result === "error"){
                    $("#error").html("Invalid course");
                    $('#input').effect('shake');
                    return;
                }
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
            type: "POST",
           async: true,
           cache:false
        }).done(function (result) {
            if(result === 'error'){
                $('#error').html("Please ADD a course code");
                $('#input').effect('shake');
            }
            else{
                window.location = "/generateTimeTable";
            }

        });

    });

});


