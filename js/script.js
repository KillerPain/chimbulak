arr = [];
content = [];
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
    send(a, b, x);
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


function getContent() {
    var date = new Date($("#datepicker").val());   
    console.log(date.toString());
    var d = {
        date: date,
    }

    $.ajax({
        url: 'http://127.0.0.1:8000/',
        type: 'get',
        dataType: 'json',
        success: function (data) {            
            content = [];
            $.each( data, function( key, val ) {
                console.log(val);
                content[val.coach] = [val.start_time, val.end_time, val.rate];  
                
            });
            createcells(content.length);
        },
        data: JSON.stringify(d)
    });
} 

function createcells(n) {
    console.log(n);
    for(var i = 1; i <= n; i++) {
        s = '<div class="cell-line">';
        for(var j = 1; j <= 32; j++) {
            s += '<div class="cell"><div class="inner-cell" id="' + i + '-' + j +'"></div></div>';
        }
        s += '/div';   
        $( "#schedule" ).append(s);
    }
}



function send(start_time, end_time, coach, rate) {    
    var date = new Date($("#datepicker").val());
    var order = {        
        date: date, 
        coach: coach,
        start_time: start_time + 16,
        end_time: end_time + 16, 
        rate: rate,
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
    setDate(null);
    getContent();

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
            coaches.push(val);
        });
        setMenu();
    });
    
});

function setDate(a) {
    if(a == null) {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10) {
            dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = mm+'/'+dd+'/'+yyyy;
    $('#datepicker').val(today);
    } else {
        $('#datepicker').val(a.toString());
    }
}


function setMenu() {
    for(var i = 0; i < coaches.length; i++) {        
         s = '<div class="line"> <span class="glyphicon glyphicon-ok icon" aria-hidden="true"></span> <span class="text">' +  coaches[i].first_name + ' ' + coaches[i].last_name + '</span> </div>'
         $( "#menu" ).append(s);
    }
}