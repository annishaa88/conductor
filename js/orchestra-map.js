// stores the device context of the canvas we use to draw the outlines
// initialized in myInit, used in myHover and myLeave
var hdc;

// takes a string that contains coords eg - "227,307,261,309, 339,354, 328,371, 240,331"
// draws a line from each co-ord pair to the next - assumes starting point needs to be repeated as ending point.
function drawPoly(coOrdStr) {
    var mCoords = coOrdStr.split(',');
    var i, n;
    n = mCoords.length;

    hdc.beginPath();
    hdc.moveTo(mCoords[0], mCoords[1]);
    for (i = 2; i < n; i += 2) {
        hdc.lineTo(mCoords[i], mCoords[i + 1]);
    }
    hdc.lineTo(mCoords[0], mCoords[1]);
    hdc.stroke();
}

function drawRect(coOrdStr) {
    var mCoords = coOrdStr.split(',');
    var top, left, bot, right;
    left = mCoords[0];
    top = mCoords[1];
    right = mCoords[2];
    bot = mCoords[3];
    hdc.strokeRect(left, top, right - left, bot - top);
}

function drawCircle(coOrdStr) {
    var mCoords = coOrdStr.split(',');
    var centerX, centerY, radius;
    centerX = mCoords[0];
    centerY = mCoords[1];
    radius = mCoords[2];
    hdc.beginPath();
    hdc.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    hdc.stroke();
}

function myHover(element) {
    var hoveredElement = element;
    var coordStr = element.getAttribute('coords');
    var areaType = element.getAttribute('shape');

    switch (areaType) {
        case 'polygon':
        case 'poly':
            drawPoly(coordStr);
            break;
        case 'circle':
            drawCircle(coordStr);
            break;

        case 'rect':
            drawRect(coordStr);
    }
}

function myLeave() {
    var canvas = $('#myCanvas');
    hdc.clearRect(0, 0, canvas.width(), canvas.height());
}

function imageMapInit() {
    // get the target image
    var imageMap = $('#img-imgmap');

    var x, y, w, h;

    // get it's position and width+height
    x = imageMap.offset().left;
    y = imageMap.offset().top;
    w = imageMap.width();
    h = imageMap.height();

    // move the canvas, so it's contained by the same parent as the image
    var imgParent = imageMap.parent();
    var can = $('#myCanvas');
    imgParent.append(can);

    // place the canvas in front of the image
    can.css("zIndex", 1);

    // position it over the image
    can.css("left", x + 'px');

    // make same size as the image
    can.attr('width', w + 'px');
    can.attr('height', h + 'px');

    // get it's context
    hdc = can[0].getContext('2d');

    // set the 'default' values for the colour/width of fill/stroke operations
    hdc.fillStyle = 'red';
    hdc.strokeStyle = 'green';
    hdc.lineWidth = 4;

    $("map area").click(function () {
        return false;
    })
}


function drawStopStartCircle(instrument, isStart, callback) {
    if (!hdc) {
        return;
    }

    var instrumentArea = $("map area." + instrument);
    var coordStr = instrumentArea.attr('coords');
    var mCoords = coordStr.split(',');
    var centerX, centerY, radius;
    centerX = mCoords[0];
    centerY = mCoords[1];
    radius = mCoords[2];

    if (isStart) {
        if (instrumentArea.hasClass("start")) //already started
            return;
        instrumentArea.removeClass("stop").addClass("start");
        instrumentArea.click(function () {
            if (!instrumentArea.hasClass("start")) //already stopped
                return;
            instrumentArea.removeClass("start");
            eraseCircle();
            callback();
            console.log("start pressed " + instrument);
        });

        setTimeout(function () {
            if (!instrumentArea.hasClass("start")) //already stopped
                return;
            instrumentArea.removeClass("start");
            eraseCircle();
        }, 3000);

    } else {
        if (instrumentArea.hasClass("stop")) //already stopped
            return;
        instrumentArea.removeClass("start").addClass("stop");
        instrumentArea.click(function () {
            if (!instrumentArea.hasClass("stop")) //already started
                return;
            instrumentArea.removeClass("stop")
            eraseCircle();
            callback();
            console.log("stop pressed " + instrument);
        })

        setTimeout(function () {
            if (!instrumentArea.hasClass("stop")) //already started
                return;
            instrumentArea.removeClass("stop")
            eraseCircle();
        }, 3000);
    }

    function eraseCircle() {
//now, erase the arc by clearing a rectangle that's slightly larger than the arc
        hdc.beginPath();
        hdc.clearRect(centerX - radius - 3, centerY - radius - 3, radius * 2 + 5, radius * 2 + 5);
        hdc.closePath();
    }

    eraseCircle();

    // draw the colored region
    hdc.beginPath();
    hdc.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
    hdc.fillStyle = isStart ? 'rgba(226, 255, 198, 0.5)' : 'rgba(255, 106, 106, 0.5)';
    hdc.fill();

    // draw the stroke
    //hdc.lineWidth = 5;
    hdc.strokeStyle = isStart ? "#66CC01" : '#FF0000';
    hdc.stroke();
}