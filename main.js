let canvas;
let canvasContex;
let ballX = 200;
let ballY = 200;
let ballSpeedX = 10;
let ballSpeedY = 10;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;

const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
  let rect = canvas.getBoundingClientRect();
  let root = document.documentElement;
  let mouseX = evt.clientX - rect.left - root.scrollLeft;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  };
};

function handleMouseClick(evt) {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContex = canvas.getContext('2d');
  let framesPerSec = 24;
  setInterval(function() {
    moveEverything();
    drawEverything();
    //console.log(ballSpeedX, ballSpeedY);
  }, 1000/framesPerSec);
  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(evt) {
    let mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
  });

};

function ballReset() {
  if(player1Score >= WINNING_SCORE) {

  } else if(player2Score >= WINNING_SCORE) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function computerMovement() {
  let paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
  if (paddle2YCenter < ballY-35) {
    paddle2Y += 10;
  } else if (paddle2YCenter > ballY+35) {
    paddle2Y -= 10;
  }
};

function moveEverything() {
  if(showingWinScreen) {
    return
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;
  computerMovement();
  if (ballX > canvas.width-PADDLE_THICKNESS) {
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
      let deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedX = deltaY * 0.35;
    } else {
      player1Score++;
      ballReset();
    }
  } else if (ballX < PADDLE_THICKNESS) {
      if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
        let deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
        ballSpeedX = deltaY * 0.35;
      } else {
        player2Score++;
        ballReset();
      }
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  } else if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

};

function drawNet() {
  for(let i=0; i<canvas.height; i+=40) {
    colorRect(canvas.width/2-1, i, 2, 20, 'white');
  }
}

function drawEverything() {
  colorRect(0,0,canvas.width,canvas.height,'black');
  drawNet();
  if (showingWinScreen) {
    canvasContex.fillStyle = 'white';
    if (player1Score >= WINNING_SCORE) {
      canvasContex.fillText("Left Player Won!", 300, 100);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContex.fillText("Right Player Won!", 300, 100);
    }
    canvasContex.fillText("click to continue", canvas.width/2, 300);
    return;
  };

  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
  colorCircle(ballX, ballY, 10, 'white');
  canvasContex.fillText(player1Score, canvas.width/8, 100);
  canvasContex.fillText(player2Score, canvas.width/1.3, 100);

};

function colorCircle(centerX, centerY, radius, color) {
  canvasContex.fillStyle = color;
  canvasContex.beginPath();
  canvasContex.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContex.fill();
};

function colorRect(leftX, topY, width, height, drawColor) {
  canvasContex.fillStyle = drawColor;
  canvasContex.fillRect(leftX, topY, width, height);
}
