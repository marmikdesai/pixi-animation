(function() {
    // create an new instance of a pixi _stage - and set it to be interactive
    var _stage = new PIXI.Stage(0xFFFFFF, true);
    _stage.buttonMode = true;

    // create a _renderer instance 
	
	var width = $(window).width();
	var height = $(window).height() - 1;
	console.log(width, height);
	
    var _renderer = PIXI.autoDetectRenderer(width, height, null, true);
    _renderer.view.style.display = "block";

    // add render view to DOM
    document.getElementById("canvas-holder").appendChild(_renderer.view);

    //Constants - 
    var POINT_SPACING = 100;
    var MAIN_ROTATION = 0;

    var LINE_COLOUR = 0x2837A7;
    var LINE_WIDTH = 1;
    var LINE_ALPHA = 0.75;

    var ROWS = Math.ceil(5000 / POINT_SPACING);
    var COLS = Math.ceil(5000 / POINT_SPACING);

    var DISTANCE_THRESHOLD = 100;
    var SPEED_DIVISOR = 40;
    var FRICTION = 1;

    var _mouseIsDown = false;
    var _mouseX = 20;
    var _mouseY = 20;

    var _points = [];

    //Mask - 
    var _mask = new PIXI.Graphics();
    _mask.beginFill(0x000000, 0);
    _mask.drawRect(0, 0, width, height);
    _mask.endFill();

    var _target = new PIXI.DisplayObjectContainer();
    _stage.addChild(_target);
    _target.mask = _mask;
    _target.position.x = _target.pivot.x = 250;
    _target.position.y = _target.pivot.y = 250;
    _target.rotation = MAIN_ROTATION;

    //Graphics holder - 
    var _lines = new PIXI.Graphics();
    _target.addChild(_lines);

    //Touch events - 
    _stage.mousedown = _stage.touchstart = onMouseDown;
    _stage.mousemove = _stage.touchmove = onMouseMove;
    _stage.mouseup = _stage.touchend = onMouseUp;

    //Main loop - 
    requestAnimFrame(animate);
    init();

    function init() {
        var point;
        for (var i = 0; i < ROWS; i++) {

            _points.push([]);

            for (var j = 0; j < COLS; j++) {
                point = new PIXI.DisplayObjectContainer();

                point.position.x = POINT_SPACING * j;
                point.position.y = POINT_SPACING * i;

                if (i % 2) {
                    point.position.x += POINT_SPACING / 2;
                }

                point.origX = point.position.x;
                point.origY = point.position.y;
                point.velX = point.velY = 0;

                _points[i].push(point);

                _target.addChild(point);
            }
        }
    }

    function animate() {
        updatePointPositions();
        drawLines();
        _renderer.render(_stage);
        requestAnimFrame(animate);
    }

    function onMouseDown(mouseData) {
        _mouseIsDown = true;
    }

    function onMouseMove(mouseData) {
        var mouse = mouseData.getLocalPosition(_stage);
        _mouseX = mouse.x;
        _mouseY = mouse.y;
    }

    function onMouseUp(mouseData) {
        _mouseIsDown = false;
    }

    function updatePointPositions() {
        var distance;
        var numRows = _points.length;
        var num_points;
        var row;
        var thisPoint;
        var inMouseRange;

        for (var j = 0; j < numRows; j++) {
            row = _points[j];
            num_points = row.length;
            for (var i = 0; i < num_points; i++) {
                thisPoint = row[i];
                inMouseRange = false;
                if (_mouseIsDown) {
                    distance = dist(thisPoint.position.x, thisPoint.position.y, _mouseX, _mouseY);
                    if (distance < DISTANCE_THRESHOLD) {
                        inMouseRange = true;
                        thisPoint.gotoX = _mouseX;
                        thisPoint.gotoY = _mouseY;
                    }
                }
                if (!inMouseRange) {
                    thisPoint.gotoX = thisPoint.origX;
                    thisPoint.gotoY = thisPoint.origY;
                }

                thisPoint.distX = (thisPoint.position.x - thisPoint.gotoX);
                thisPoint.distY = (thisPoint.position.y - thisPoint.gotoY);

                if (inMouseRange) {
                    thisPoint.distX *= -1;
                    thisPoint.distY *= -1;
                }

                thisPoint.velX += thisPoint.distX / SPEED_DIVISOR;
                thisPoint.velY += thisPoint.distY / SPEED_DIVISOR;

                thisPoint.position.x -= thisPoint.velX;
                thisPoint.position.y -= thisPoint.velY;

                thisPoint.velX *= FRICTION;
                thisPoint.velY *= FRICTION;
            }
        }

    }

    function drawLines() {

        _lines.clear();

        _lines.lineStyle(LINE_WIDTH, LINE_COLOUR, LINE_ALPHA);

        var numRows = _points.length;
        var num_points;
        var row;
        var thisPoint;
        var linkedPoint;

        for (var j = 0; j < numRows; j++) {
            row = _points[j];
            num_points = row.length;
            for (var i = 0; i < num_points; i++) {
                thisPoint = row[i]
                //Previous 
                if (i !== 0) {
                    linkedPoint = row[i - 1];
                    _lines.moveTo(thisPoint.position.x, thisPoint.position.y);
                    _lines.lineTo(linkedPoint.position.x, linkedPoint.position.y);
                }
			
                //Above i + i+1

                if (j !== 0) {

                    if (j % 2 === 0) {

                        linkedPoint = _points[j - 1][i];
                        _lines.moveTo(thisPoint.position.x, thisPoint.position.y);
                        _lines.lineTo(linkedPoint.position.x, linkedPoint.position.y);

                        if (i !== 0) {
                            linkedPoint = _points[j - 1][i - 1];
                            _lines.moveTo(thisPoint.position.x, thisPoint.position.y);
                            _lines.lineTo(linkedPoint.position.x, linkedPoint.position.y);
                        }
                    } else {
                        linkedPoint = _points[j - 1][i];
                        _lines.moveTo(thisPoint.position.x, thisPoint.position.y);
                        _lines.lineTo(linkedPoint.position.x, linkedPoint.position.y);

                        if (i !== num_points - 1) {
                            linkedPoint = _points[j - 1][i + 1];
                            _lines.moveTo(thisPoint.position.x, thisPoint.position.y);
                            _lines.lineTo(linkedPoint.position.x, linkedPoint.position.y);
                        }
                    }
                }

            }
        }
    }

    function dist(x1, y1, x2, y2) {
        var xs = 0;
        var ys = 0;

        xs = x1 - x2;
        xs = xs * xs;

        ys = y1 - y2;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    }

})();