//Pad a value from the front with zeros until it is a desired length
//eg zeroPad("5", 6) => 00005
function zeroPad(value, desiredLength) {
    value = value.toString();

    while (value.length < desiredLength) {
        value = "0" + value.toString();
    }

    return value;
}

function AlarmClock() {
    var _this = this;
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;

    this.alarms = [];
    
    this.sounder = null;

    this.init = function () {
        window.setInterval(_this.tick, 1000);
    }

    this.tick = function () {
        var date = new Date();

        _this.seconds = date.getSeconds();
        _this.minutes = date.getMinutes();
        _this.hours = date.getHours();

        $("#alarm-hours").text(zeroPad(_this.hours, 2));
        $("#alarm-minutes").text(zeroPad(_this.minutes, 2));
        $("#alarm-seconds").text(zeroPad(_this.seconds, 2));

        if (_this.checkAlarms()) {
            _this.soundAlarm();
        }
    };

    this.addAlarm = function (hours, minutes, seconds) {
        _this.alarms.push({
            "hour": hours,
            "minute": minutes,
            "second": seconds
        });

        //Add a collection item for the alarm with trashcan icon
        $("#existing-alarms-wrapper .collection").append(
            '<a href="#!" class="collection-item">' + zeroPad(hours, 2) + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + '<span class="badge"><i class="material-icons">delete</i></span></a>');
        
        //Enable the remove alarm icons
        enableRemoveAlarmButtons();
    };

    this.checkAlarms = function () {
        for (var i in _this.alarms) {
            if (_this.alarms[i].hour == _this.hours && _this.alarms[i].minute == _this.minutes && _this.alarms[i].second == _this.seconds) {
                return true;
            }
        }

        return false;
    };

    this.soundAlarm = function () {
        _this.sounder = new Audio('sounds/alarm1.mp3');
        _this.sounder.addEventListener('ended', function () {
            this.currentTime = 0;
            this.play();
        }, false);
        _this.sounder.play();
    }
    
    this.removeAlarm = function (hours, minutes, seconds) {
        var newAlarms = [];
        for (var i in _this.alarms) {
            if ( !(_this.alarms[i].hour == hours && _this.alarms[i].minute == minutes && _this.alarms[i].second == seconds)) {
                newAlarms.push(_this.alarms[i]);
            }
        }
        _this.alarms = newAlarms;
        
        $("#existing-alarms-wrapper .collection-item").each(function() {
            var text = $(this).text().split("delete")[0];
            text = text.split(":");
            
            var hours2 = parseInt(text[0]);
            var minutes2 = parseInt(text[1]);
            var seconds2 = parseInt(text[2]);
            
            if(hours2 == hours && minutes2 == minutes && seconds2 == seconds) {
                $(this).remove();   
            }
        });
    };
}

var clock = new AlarmClock();
//clock.tick(); //Set initial value so we dont have to wait for window.setInterval
clock.init();

$(document).ready(function () {
    $(".button-collapse").sideNav();

    //Prefill add alarm <selects> with <options> for hours/minutes/seconds
    //Hours
    for (var i = 1; i < 24; i++) {
        $("#alarm-add-hours").append('<option value="' + i + '">' + zeroPad(i, 2) + '</option>');
    }

    //Minutes
    for (var i = 1; i < 60; i++) {
        $("#alarm-add-minutes").append('<option value="' + i + '">' + zeroPad(i, 2) + '</option>');
    }

    //Seconds
    for (var i = 1; i < 60; i++) {
        $("#alarm-add-seconds").append('<option value="' + i + '">' + zeroPad(i, 2) + '</option>');
    }

    //Enable add alarm button
    $("#add-alarm-button").click(function () {
        var h = $("#alarm-add-hours").val();
        var m = $("#alarm-add-minutes").val();
        var s = $("#alarm-add-seconds").val();

        clock.addAlarm(h, m, s);
    });
    
    //Enable mute button
    $("#volume-off").click(function() {
       clock.sounder.pause(); 
    });
});

function enableRemoveAlarmButtons() {
    $("#existing-alarms-wrapper .collection-item").each(function() {
        $(this).click(function() {
            //$(this).text() looks like 12:34:56delete due to trash icon
            var text = $(this).text().split("delete")[0];
            text = text.split(":");
            
            var hours = parseInt(text[0]);
            var minutes = parseInt(text[1]);
            var seconds = parseInt(text[2]);
            
            clock.removeAlarm(hours, minutes, seconds);
        });
    });
}
