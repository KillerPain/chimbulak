arr = [];
rates = [];
coaches = [];
sendingStartTime = 0;
sendingEndTime = 0;
sendingCoachID = 0;


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
    
}

function ff(a, b, x) {
    for (var i = a; i <= b; i++) {
        id = x + "-" + i.toString();
        element = document.getElementById(id);
        element.className = "inner-cell"
    }
}

function getContent() {
    var date = new Date($("#datepicker").val());   
    var d = {
        date: date,
    }

    $.ajax({
        url: 'http://127.0.0.1:8000/',
        type: 'get',
        dataType: 'json',
        success: function (data) {     
            //console.log(data[0].start_time);       
            vizualizeContent(data);
        },
        data: JSON.stringify(d)
    });
} 

function vizualizeContent(data) {

    for(var i = 0; i < data.length; i++) {

        a = (data[i].start_time.hour - 8)*2 + 1;
        if(data[i].start_time.minute != 0) {
            a += 1;   
        }
        b = (data[i].end_time.hour - 8)*2 + 1;
        if(data[i].end_time.minute != 0) {
            b += 1;   
        }
        
        f(a,b,data[i].coach);

    }
}

function createcells(n, callback) {

    for(var i = 1; i <= n; i++) {
        s = '<div class="cell-line">';
        for(var j = 1; j <= 32; j++) {
            s += '<div class="cell"><div class="inner-cell" id="' + i + '-' + j +'"></div></div>';
        }
        s += '</div>';   
        $( "#schedule" ).append(s);
    }

    callback();
    
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

function modal() {
    // console.log('kuku');
     $("#myModal").modal('show');
}

function logic() {
     $('.inner-cell').click(function(e) {
        var clickedBtnID = $(this).attr('id');
        hz = $(this).attr('class').split(' ');

        if(hz[1] === 'selected') {
            modal();         
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
                sendingCoachID = ids[0];
                sendingStartTime = a;
                sendingEndTime = b;
                //send(a, b, ids[0]);
                modal(); 
                return;
            }
            else {
                arr[ids[0]].push([ids[1]]);
            }

        }

        document.getElementById(clickedBtnID).className = "inner-cell selected"


    } );
} 

function loadRates() {
    $.ajax({
        url: 'http://127.0.0.1:8000/rates/',
        type: 'get',
        dataType: 'json',
        success: function (data) {     
            rates = data;
            for(var i = 0; i < rates.length; i++) {
                 $('#money').append('<option value="' +  rates[i].id + '">' + rates[i].price + '</option>');
            }                
        },        
    });
} 

$(document).ready(function() {
    setDate(null);
    loadRates();
    
    $.getJSON( "http://localhost:8000/coaches/", function( data ) {
        var items = [];
        $.each( data, function( key, val ) {
            coaches.push(val);
        });
        setMenu();
        createcells(coaches.length, logic);
        getContent();
    });
    
   

    $('#datepicker').datepicker();
    $('#datepicker-btn').click(function(e) {
        $('#datepicker').datepicker('show');
    });


    $("#saveChanges").click(function() {
        rateid = $("#money option:selected").val();
        console.log(rateid);
        $("#myModal").modal('hide');
        send(sendingStartTime, sendingEndTime, sendingCoachID, rateid);
    });

    closeCancel

    $("#closeCancel").click(function() {
        ff(sendingStartTime, sendingEndTime, sendingCoachID);
    });
    $("#closeBtn").click(function() {
        ff(sendingStartTime, sendingEndTime, sendingCoachID);
    });
    
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
        a = '<img src="images/skier-skiing.svg" alt="" class="icon">';
        b = '<img src="images/snowboarding.svg" alt="" class="icon">';
        if(!coaches[i].can_train_skiing) 
            a= '<img src="images/skier-skiing1.svg" alt="" class="icon">';
        if(!coaches[i].can_train_snowboard)
            b = '<img src="images/snowboarding1.svg" alt="" class="icon">';

        s = '<div class="line"><div class="icons">' + a +
            b + '</div><span class="text">'
             +  coaches[i].first_name + ' ' + coaches[i].last_name + '</span> </div>'
        $( "#menu" ).append(s);
    }
}