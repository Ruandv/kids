document.addEventListener("DOMContentLoaded", () => {
    // Get the canvas element
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const bulletSpeed = 5;
    // Define game state variables
    let playerX = canvas.width / 2;
    const playerY = canvas.height - 30;
    const bullets = [{ x: 0, y: 0, color: "#f30" }];
    const obstacles = [{ hits: 5, x: 50, y: 90, color: "#f07" }];

    // Define game loop
    function draw() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the player
        ctx.beginPath();
        ctx.rect(playerX - 25, playerY, 50, 10);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();

        // Draw bullets
        bullets.forEach(bullet => {
            // check if the bullet hits an obstacle
            obstacles.forEach(obstacle => {
                if (bullet.x < obstacle.x + 50 &&
                    bullet.x + 2 > obstacle.x &&
                    bullet.y < obstacle.y + 50 &&
                    bullet.y + 5 > obstacle.y) {
                    console.log("hit")
                    obstacle.hits -= 1;
                    bullets.splice(bullets.indexOf(bullet), 1);
                    if (obstacle.hits === 0) {
                        obstacles.splice(obstacles.indexOf(obstacle), 1);
                        // create a new random obstable
                        obstacles.push({ x: Math.floor(Math.random() * 450), y: 0, color: getRandomColor(), hits: 5 });
                    }
                }
            });
            ctx.beginPath();
            ctx.rect(bullet.x, bullet.y, 2, 5);
            ctx.fillStyle = bullet.color;
            ctx.fill();
            ctx.closePath();
            bullet.y -= bulletSpeed;

            // Remove bullets that go off-screen
            if (bullet.y < 0) {
                bullets.splice(bullets.indexOf(bullet), 1);
            }
        });

        // Draw obstacles
        obstacles.forEach(obstacle => {
            ctx.beginPath();
            ctx.fillStyle = "red"; // Set obstacle color to red
            ctx.fillRect(obstacle.x, obstacle.y, 50, 50); // Draw red rectangle
            // draw the number of hits left on the obstacle
            ctx.font = "28px Arial";
            ctx.fillStyle = "#fff";
            ctx.fillText(obstacle.hits, obstacle.x + 20, obstacle.y + 30);
            ctx.closePath();
        });
    }

    // Handle user input
    function handleInput(event) {
        // check the event type

        if (event.type === "mousemove") {
            // check if the cursor is within the canvas
            if (event.clientX > canvas.offsetLeft &&
                event.clientX < canvas.offsetLeft + canvas.width) {

                playerX = event.clientX - canvas.offsetLeft;
            }
        }
        else if (event.type === "click") {
            bullet = { x: playerX, y: playerY, color: getRandomColor() };
            bullets.push(bullet)
            bulletSound.play();
        }
        else if (event.type === "keydown") {

            const key = event.key;
            console.log(key)
            // Move the player left or right
            if (key === "ArrowLeft" && playerX > 25) {
                playerX -= 5;
            } else if (key === "ArrowRight" && playerX < canvas.width - 25) {
                playerX += 5;
            }
            else if (key === " ") {
                bulletSound.currentTime = 0;
                bullet = { x: playerX, y: playerY, color: getRandomColor() };
                bullets.push(bullet)
                bulletSound.play();
            }
        }
    }

    // Function to generate random RGB color
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }
    // Add event listener for keyboard input
    document.addEventListener("keydown", handleInput);
    document.addEventListener("mousemove", handleInput);
    document.addEventListener("click", handleInput);

    // Start the game loop
    setInterval(draw, 10);
});