document.addEventListener("DOMContentLoaded", () => {
    // Get the canvas element
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const bulletSpeed = 5;
    // Define game state variables
    let playerX = canvas.width / 2;
    const playerY = canvas.height - 30;
    const bullets = [{ x: 0, y: 0, color: "#f30" }];
    const obstacles = [{ hits: getRandomNumber(), x: 50, y: 90, color: "#f07" }];

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

        // Draw number
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
        const key = event.key;
        if (key.toString() === obstacles[0].hits.toString()) {
            playerX -= 5;
            // create a new obstacle
            obstacles.splice(0, 1);
            obstacles.push({ x: Math.floor(Math.random() * 450), y: 0, color: getRandomColor(), hits: getRandomNumber() });
        } else {
        }
        bulletSound.currentTime = 0;
        bulletSound.play();
    }

    // Function to generate random RGB color
    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Function to generate random RGB color
    function getRandomNumber() {
        // generate a number between 1 and 9
        const num=  Math.floor(Math.random() * 9) + 1;
        bulletSound.src = `../sounds/number${num}.mp4`;
        bulletSound.play();
        return num;
    }

    // Add event listener for keyboard input
    document.addEventListener("keydown", handleInput);

    // Start the game loop
    setInterval(draw, 10);
});