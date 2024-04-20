document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let playerImage = new Image();
    playerImage.onload = function() {
        // Next steps, e.g., start the game or ensure all assets are loaded
    };
    playerImage.src = 'images/kindpng_156391.png'; // Make sure the path is correct
    let enemyImage = new Image();
enemyImage.onload = function() {
    // Image is now loaded and can be used.
    // You might want to start the game or enable certain features here.
};
enemyImage.src = 'images/naizk.png';  // Make sure this path is correctly pointing to your image file.
    let player = { x: 100, y: canvas.height / 2, width: 40, height: 40 };
    let lasers = [];
    let enemies = [];
    let score = 0;
    let isGameOver = false;
    const keysPressed = {};

    function spawnEnemy() {
        // Create enemies at random positions on the right edge
        enemies.push({ x: canvas.width, y: Math.random() * canvas.height, width: 50, height: 50, speed: 3 });
    }

    document.addEventListener('keydown', (e) => keysPressed[e.key] = true);
    document.addEventListener('keyup', (e) => {
        keysPressed[e.key] = false;
        if(e.key === 'f') shootLaser(); // Shoot with 'f'
    });

    function shootLaser() {
        if(!isGameOver) lasers.push({ x: player.x + player.width, y: player.y + player.height / 2 });
    }

    function update() {
        if(isGameOver) return displayGameOver();

        handleMovement();
        handleLasers();
        handleEnemies();

        collisionDetection();
        drawEverything();
    }

    function handleMovement() {
        if (keysPressed['w']) player.y -= 5;
        if (keysPressed['s']) player.y += 5;
        if (keysPressed['a']) player.x -= 5;
        if (keysPressed['d']) player.x += 5;
    }

    function handleLasers() {
        lasers = lasers.filter(laser => laser.x < canvas.width);
        lasers.forEach(laser => laser.x += 10);
    }

    function handleEnemies() {
        enemies.forEach(enemy => enemy.x -= enemy.speed);
        enemies = enemies.filter(enemy => enemy.x + enemy.width > 0);
    }

    function collisionDetection() {
        enemies.forEach((enemy, index) => {
            lasers.forEach((laser, laserIndex) => {
                if(laser.x < enemy.x + enemy.width && laser.x + 20 > enemy.x &&
                laser.y < enemy.y + enemy.height && laser.y + 5 > enemy.y) {
                    enemies.splice(index, 1);
                    lasers.splice(laserIndex, 1);
                    score += 10; // Increase score for destorying enemy
                }
            });

            // Check collision with player
            if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
                isGameOver = true; // Player dies
            }
        });
    }

    function drawEverything() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(isGameOver) return;

        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);


        // Draw lasers
        lasers.forEach(laser => {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(laser.x, laser.y, 20, 2);
        });

        enemies.forEach(enemy => {
            // Using ctx.drawImage to draw the enemy image instead of a simple fillRect for a red rectangle
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        });
        // Draw score
        ctx.font = '18px Arial';
        ctx.fillStyle = 'white';
    }

    function displayGameOver(){
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText("Game Over", canvas.width / 2 - 150, canvas.height / 2);
    }

    setInterval(spawnEnemy, 2000); // Spawn an enemy every 2 seconds
    setInterval(update, 10); // Game update loop
});


