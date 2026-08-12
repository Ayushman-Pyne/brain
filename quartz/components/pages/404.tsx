import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg, ctx }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = ctx.argv.serve ? "/" : url.pathname

  return (
    <article class="popover-hint" style={{ textAlign: "center" }}>
      <h1>404</h1>
      <p>{i18n(cfg.locale).pages.error.notFound}</p>
      <div style={{ margin: "20px 0" }}>
        <canvas
          id="404-game"
          width="380"
          height="220"
          style={{
            display: "block",
            margin: "0 auto",
            border: "2px solid var(--lightgray)",
            borderRadius: "8px",
            background: "rgba(0,0,0,0.03)",
            cursor: "crosshair",
            maxWidth: "100%",
          }}
        />
      </div>
      <a href={baseDir}>{i18n(cfg.locale).pages.error.home}</a>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          if (typeof fetchData !== "undefined") {
            fetchData.then(function(index) {
              var basePath = document.body.dataset.basepath || "";
              if (basePath.length > 1 && basePath.endsWith("/")) {
                basePath = basePath.slice(0, -1);
              }
              var pathname = window.location.pathname;
              var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
              if (hasBasePrefix) {
                pathname = pathname.slice(basePath.length);
              }
              if (pathname.startsWith("/")) {
                pathname = pathname.slice(1);
              }
              if (pathname.endsWith("/")) {
                pathname = pathname.slice(0, -1);
              }
              if (pathname.endsWith(".html")) {
                pathname = pathname.slice(0, -5);
              }
              if (pathname.endsWith("/index")) {
                pathname = pathname.slice(0, -6);
              }
              var lowered = pathname.toLowerCase();
              if (lowered !== pathname && index[lowered] != null) {
                var prefix = hasBasePrefix ? basePath : "";
                var target = prefix + (prefix.endsWith("/") ? "" : "/") + lowered;
                window.location.replace(target);
              }
            });
          }

          // Brick Breaker 404 Game Code
          (function() {
            var canvas = document.getElementById("404-game");
            if (!canvas) return;
            var ctx = canvas.getContext("2d");
            var score = 0;
            var lives = 3;
            var gameOver = false;
            var gameStarted = false;

            var getThemeColor = function(varName) {
              return getComputedStyle(document.body).getPropertyValue(varName).trim();
            };

            var ballRadius = 6;
            var x = canvas.width / 2;
            var y = canvas.height - 30;
            var dx = 2;
            var dy = -2;

            var paddleHeight = 8;
            var paddleWidth = 75;
            var paddleX = (canvas.width - paddleWidth) / 2;

            var rightPressed = false;
            var leftPressed = false;

            var brickRowCount = 3;
            var brickColumnCount = 6;
            var brickWidth = 50;
            var brickHeight = 12;
            var brickPadding = 8;
            var brickOffsetTop = 30;
            var brickOffsetLeft = 20;

            var bricks = [];
            function initBricks() {
              for (var c = 0; c < brickColumnCount; c++) {
                bricks[c] = [];
                for (var r = 0; r < brickRowCount; r++) {
                  bricks[c][r] = { x: 0, y: 0, status: 1 };
                }
              }
            }
            initBricks();

            document.addEventListener("keydown", keyDownHandler, false);
            document.addEventListener("keyup", keyUpHandler, false);
            document.addEventListener("mousemove", mouseMoveHandler, false);

            function keyDownHandler(e) {
              if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = true;
              } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = true;
              }
            }

            function keyUpHandler(e) {
              if (e.key === "Right" || e.key === "ArrowRight") {
                rightPressed = false;
              } else if (e.key === "Left" || e.key === "ArrowLeft") {
                leftPressed = false;
              }
            }

            function mouseMoveHandler(e) {
              var rect = canvas.getBoundingClientRect();
              var relativeX = e.clientX - rect.left;
              if (relativeX > 0 && relativeX < canvas.width) {
                paddleX = relativeX - paddleWidth / 2;
              }
            }

            function collisionDetection() {
              for (var c = 0; c < brickColumnCount; c++) {
                for (var r = 0; r < brickRowCount; r++) {
                  var b = bricks[c][r];
                  if (b.status === 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                      dy = -dy;
                      b.status = 0;
                      score++;
                      if (score === brickRowCount * brickColumnCount) {
                        drawWin();
                        gameOver = true;
                      }
                    }
                  }
                }
              }
            }

            function drawBall() {
              ctx.beginPath();
              ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
              ctx.fillStyle = getThemeColor("--secondary") || "#284b63";
              ctx.fill();
              ctx.closePath();
            }

            function drawPaddle() {
              ctx.beginPath();
              ctx.rect(paddleX, canvas.height - paddleHeight - 5, paddleWidth, paddleHeight);
              ctx.fillStyle = getThemeColor("--tertiary") || "#84a59d";
              ctx.fill();
              ctx.closePath();
            }

            function drawBricks() {
              var colors = [getThemeColor("--secondary"), getThemeColor("--tertiary"), getThemeColor("--gray")];
              for (var c = 0; c < brickColumnCount; c++) {
                for (var r = 0; r < brickRowCount; r++) {
                  if (bricks[c][r].status === 1) {
                    var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = colors[r % colors.length] || "#84a59d";
                    ctx.fill();
                    ctx.closePath();
                  }
                }
              }
            }

            function drawScore() {
              ctx.font = "12px sans-serif";
              ctx.fillStyle = getThemeColor("--dark") || "#2b2b2b";
              ctx.textAlign = "left";
              ctx.fillText("Score: " + score, 8, 20);
            }

            function drawLives() {
              ctx.font = "12px sans-serif";
              ctx.fillStyle = getThemeColor("--dark") || "#2b2b2b";
              ctx.textAlign = "right";
              ctx.fillText("Lives: " + lives, canvas.width - 8, 20);
            }

            function drawStartScreen() {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.font = "bold 16px sans-serif";
              ctx.fillStyle = getThemeColor("--dark") || "#2b2b2b";
              ctx.textAlign = "center";
              ctx.fillText("404 Brick Breaker", canvas.width / 2, canvas.height / 2 - 10);
              ctx.font = "12px sans-serif";
              ctx.fillText("Click to Play", canvas.width / 2, canvas.height / 2 + 15);
            }

            function drawGameOver() {
              ctx.font = "bold 16px sans-serif";
              ctx.fillStyle = getThemeColor("--secondary") || "#d9383a";
              ctx.textAlign = "center";
              ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
              ctx.font = "12px sans-serif";
              ctx.fillStyle = getThemeColor("--dark") || "#2b2b2b";
              ctx.fillText("Click to Restart", canvas.width / 2, canvas.height / 2 + 15);
            }

            function drawWin() {
              ctx.font = "bold 16px sans-serif";
              ctx.fillStyle = getThemeColor("--tertiary") || "#84a59d";
              ctx.textAlign = "center";
              ctx.fillText("YOU WIN!", canvas.width / 2, canvas.height / 2 - 10);
              ctx.font = "12px sans-serif";
              ctx.fillStyle = getThemeColor("--dark") || "#2b2b2b";
              ctx.fillText("Click to Play Again", canvas.width / 2, canvas.height / 2 + 15);
            }

            function resetGame() {
              x = canvas.width / 2;
              y = canvas.height - 30;
              dx = 2;
              dy = -2;
              paddleX = (canvas.width - paddleWidth) / 2;
            }

            canvas.addEventListener("click", function() {
              if (!gameStarted || gameOver) {
                score = 0;
                lives = 3;
                gameOver = false;
                gameStarted = true;
                initBricks();
                resetGame();
                draw();
              }
            });

            function draw() {
              if (!gameStarted) {
                drawStartScreen();
                return;
              }
              if (gameOver) {
                return;
              }

              ctx.clearRect(0, 0, canvas.width, canvas.height);
              drawBricks();
              drawBall();
              drawPaddle();
              drawScore();
              drawLives();
              collisionDetection();

              if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
                dx = -dx;
              }
              if (y + dy < ballRadius) {
                dy = -dy;
              } else if (y + dy > canvas.height - ballRadius - 5) {
                if (x > paddleX && x < paddleX + paddleWidth) {
                  dy = -dy;
                  var hitPos = (x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
                  dx = hitPos * 3;
                } else {
                  lives--;
                  if (!lives) {
                    drawGameOver();
                    gameOver = true;
                  } else {
                    resetGame();
                  }
                }
              }

              if (rightPressed && paddleX < canvas.width - paddleWidth) {
                paddleX += 7;
              } else if (leftPressed && paddleX > 0) {
                paddleX -= 7;
              }

              x += dx;
              y += dy;

              if (!gameOver) {
                requestAnimationFrame(draw);
              }
            }

            drawStartScreen();
          })();
          `,
        }}
      />
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
