// Source - https://stackoverflow.com/a/30684711
// Posted by Matěj Pokorný
// Retrieved 2026-03-09, License - CC BY-SA 3.0

// create canvas element and append it to document body
// var canvas = document.createElement('canvas');
// document.body.appendChild(canvas);

var canvas = document.getElementById('drawing_canvas');
var canvas_container = document.getElementById('drawing_canvas_id');
// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;

canvas_container.style.position = 'fixed';
canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
resize();
var drawing_area = document.getElementsByClassName("drawing_area");

// last known position
var pos = { x: 0, y: 0 };

window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);

// new position from mouse event
function setPosition(e) {
  const rect = canvas.getBoundingClientRect();

  pos.x = e.clientX - rect.left;
  pos.y = e.clientY - rect.top;
}

// resize canvas
function resize() {
  ctx.canvas.width = canvas_container.clientWidth;
  ctx.canvas.height = canvas_container.clientHeight;

  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function return_canvas_img(){
  return canvas.toDataURL('image/png');
}

function draw(e) {
  // mouse left button must be pressed
  if (e.buttons !== 1) return;

  // setPosition(e);

  ctx.beginPath(); // begin

  ctx.lineWidth = document.getElementById("brushSize").value;
  ctx.lineCap = 'round';
  ctx.strokeStyle = document.getElementById("favcolor").value
  // ctx.strokeStyle = '#a90202';

  ctx.moveTo(pos.x, pos.y); // from
  setPosition(e);
  ctx.lineTo(pos.x, pos.y); // to

  ctx.stroke(); // draw it!
}
function clearCanvas(){
  resize();
}

function makeNormalMap(){
  Demo.Set_Image_as_Normal();
}

function showDrawingArea(){
  drawing_area[0].style.display = 'block';
  resize();
}

function hideDrawingArea(){
  drawing_area[0].style.display = 'none';
}

