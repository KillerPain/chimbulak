arr = [];
coaches = [];

function f(a, b, x) {
    for (var i = a + 1; i < b; i++) {
        id = x + "-" + i.toString();
        element = document.getElementById(id);
        element.className = "inner-cell selected"
    }
    id = x + "-" + a.toString();
    element = document.getElementById(id);
    element.className = "inner-cell selected left";
    
    id = x + "-" + b.toString();
    element = document.getElementById(id);
    element.className = "inner-cell selected right";
    send(a,b);
}

function ff(a, b, x) {
    for (var i = a; i <= b; i++) {
        id = x + "-" + i.toString();
        element = document.getElementById(id);
        element.className = "inner-cell"
    }
}

function hui(){

}




function send(a,b) {
    
    var date = new Date($("#datepicker").val());
    var order = {        
        date: date, 
        coach:3,
        start_time: a + 16,
        end_time: b + 16, 
        rate: 2,
    }
    //$('#target').html('sending..');
    $.ajax({
        url: 'http://127.0.0.1:8000',
        type: 'post',
        dataType: 'json',
        success: function (data) {            
            //$('#target').html(data.msg);
        },
        data: JSON.stringify(order)
    });
}

$(document).ready(function() {
    $('.inner-cell').click(function(e) {
        var clickedBtnID = $(this).attr('id');
        hz = $(this).attr('class').split(' ');

        if(hz[1] === 'selected') {
            hui();           
            return;
        }

        ids = clickedBtnID.split('-');

        if (arr[ids[0]] === undefined) {
            arr[ids[0]] = [];
            arr[ids[0]].push([ids[1]]);

        } else {
        
            cur = arr[ids[0]][arr[ids[0]].length-1];
            if(cur.length == 1) {
                cur.push(ids[1]);
                a = parseInt(cur[1]);
                b = parseInt(cur[0]);
                if (a > b) {
                    tmp = a;
                    a = b;
                    b = tmp;
                }
                f(a, b, ids[0]);
                return;
            }
            else {
                 arr[ids[0]].push([ids[1]]);
            }

        }

        document.getElementById(clickedBtnID).className = "inner-cell selected"


    });
    
    $('#datepicker').datepicker();
    $('#datepicker-btn').click(function(e) {
        $('#datepicker').datepicker('show');
    });


    // document.addEventListener("dragover", function(e){
    //     e = e || window.event;
    //     var dragX = e.pageX, dragY = e.pageY;

    //     console.log("X: "+dragX+" Y: "+dragY);
    // }, false);

    // //  jQuery

    // $("body").bind("dragover", function(e){
    //     var dragX = e.pageX, dragY = e.pageY;

    //     console.log("X: "+dragX+" Y: "+dragY);
    // });

    $.getJSON( "http://localhost:8000/coaches/", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
            // console.log(key);
            console.log(val.first_name);
            coaches.push(val);
        });                
        setMenu();
    });

    
    
});


function setMenu() {
    console.log(coaches.length);

    for(var i = 0; i < coaches.length; i++) {        
         s = '<div class="line"> <span class="glyphicon glyphicon-ok icon" aria-hidden="true"></span> <span class="text">' +  coaches[i].first_name + ' ' + coaches[i].last_name + '</span> </div>'
         $( "#menu" ).append(s);

         

    }
}