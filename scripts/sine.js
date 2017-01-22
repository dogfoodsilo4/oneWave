(function () {

if (typeof(Humble) == 'undefined') window.Humble = {};
Humble.Trig = {};
Humble.Trig.init = init;

var chatter = new Howl({
  src: ['res/sounds/chatter.mp3'],
  buffer: true,
  loop: true,
  volume: 0.1
});

var cheer = new Howl({
  src: ['res/sounds/cheer.mp3'],
  volume: 0.2,
  loop: false
});

var canvas, playerCanvas, context, playerContext,
    height, width, xAxis, yAxis,
    draw,
    targetAmp, targetPhase, playerAmp, playerPhase,
    frequency, pauseGamePlay;

var targetColour = '#30c';
var targetWidth = 14;
var playerColour = '#f90';
var playerWidth = 10;
var pauseGamePlay = false;

var wHeight = 800; //document.body.clientHeight;
var wWidth = document.body.clientWidth;

/**
Use the left and right keys to control the phase of the player wave.
Use the up and down keys to control the targetAmp of the wave.
Match the waves to make the music sound good.
*/

/*TODO:
put on git
*/

/**
 * Initialize variables and begin the animation.
 */
function init() {

    canvas = document.getElementById("canvas");
    canvas.width = wWidth;
    canvas.height = wHeight;
    context = canvas.getContext("2d");

    playerCanvas = document.getElementById("canvas");
    playerCanvas.width = wWidth;
    playerCanvas.height = wHeight;
    playerContext = playerCanvas.getContext("2d");

    context.font = '18px sans-serif';
    context.strokeStyle = '#fff';
    context.lineJoin = 'round';

    height = canvas.height;
    width = canvas.width;

    xAxis = Math.floor(height/2);
    yAxis = 1; //Math.floor(width/16);

    frequency = 0.02;

    newGame();

    chatter.play();

    context.save();
    draw();
}

document.onkeydown = function(e)
{
    onkeydown(e);
}

function onkeydown(e)
{
    if (!pauseGamePlay)
    {
        //var left = 37, up = 38, right = 39, down = 40;
        var left = 65, up = 87, right = 68, down = 83;
        switch (e.keyCode)
        {
            case left:
                playerPhase -= 1;
                break;
            case right:
                playerPhase += 1;
                break;
            case up:
                playerAmp += 1;
                break;
            case down:
                playerAmp -= 1;
                break;
            default:
                // Not a key we care about
        }
    }
}

function newGame()
{
    targetAmp = Math.floor((Math.random() * 200) + 50);
    targetPhase = Math.floor((Math.random() * 40) + -40);
    playerAmp = Math.floor((Math.random() * 200) + 50);;
    playerPhase = Math.floor((Math.random() * 40) + -40);
}

/**
 * Draw animation function.
 * This function draws one frame of the animation, waits 20ms, and then calls
 * itself again.
 */
draw = function () {

    // Clear the canvas
    context.clearRect(0, 0, width, height);
    context.save();

    context.fillStyle = '#fff';

    // Draw the sine curve at time draw.t, as well as the circle.

    context.beginPath();
    // Target Sine
    drawTargetSine(draw.t);
    context.stroke();

    // Player Sine
    playerContext.beginPath();
    drawPlayerSine(draw.t);
    playerContext.stroke();

    isMatch();

    // Update the time and draw again
    draw.seconds = draw.seconds - frequency;
    draw.t = draw.seconds*Math.PI;
    setTimeout(draw, 35);
};
draw.seconds = 0;
draw.t = 0;

/**
 * Function to draw sine
 * The sine curve is drawn in 10px segments starting at the origin.
 */
function drawTargetSine(t) {

    context.strokeStyle = targetColour; // wave colour
    context.lineWidth = targetWidth;

    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t;
    var y = Math.sin(x);
    context.moveTo(yAxis, targetAmp*y+xAxis+targetPhase);

    // Loop to draw segments
    for (i = yAxis; i <= width; i += 10) {
        x = t+(-yAxis+i)/targetAmp;
        y = Math.sin(x);

        context.lineTo(i, targetAmp*y+xAxis+targetPhase);
    }
}

/**
 * Function to draw sine
 * The sine curve is drawn in 10px segments starting at the origin.
 */
function drawPlayerSine(t) {

    playerContext.strokeStyle = playerColour; // wave colour
    playerContext.lineWidth = playerWidth;

    // Set the initial x and y, starting at 0,0 and translating to the origin on
    // the canvas.
    var x = t;
    var y = Math.sin(x);
    playerContext.moveTo(yAxis, playerAmp*y+xAxis+playerPhase);

    // Loop to draw segments
    for (i = yAxis; i <= width; i += 10) {
        x = t+(-yAxis+i)/playerAmp;
        y = Math.sin(x);

        playerContext.lineTo(i, playerAmp*y+xAxis+playerPhase);
    }
}

function isMatch()
{
    if (!pauseGamePlay)
    {
        if (targetAmp === playerAmp && targetPhase === playerPhase)
        {
            cheer.play();
            pauseGamePlay = true;
            setTimeout(function() {
                pauseGamePlay = false;
                newGame();
            }, 3000);
        }
    }
}

    Humble.Trig.init()

})();
