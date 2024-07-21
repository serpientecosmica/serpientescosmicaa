document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const startButton = document.getElementById('start-button');
    const gameOverDisplay = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    const upButton = document.getElementById('up-button');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const downButton = document.getElementById('down-button');

    let snake = [{ x: 200, y: 200 }];
    let direction = { x: 20, y: 0 };
    let food = { x: 0, y: 0 };
    let score = 0;
    let gameInterval;

    function randomFoodPosition() {
        const x = Math.floor(Math.random() * (gameArea.clientWidth / 20)) * 20;
        const y = Math.floor(Math.random() * (gameArea.clientHeight / 20)) * 20;
        return { x, y };
    }

    function drawSnake() {
        gameArea.innerHTML = '';
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.style.left = `${segment.x}px`;
            snakeElement.style.top = `${segment.y}px`;
            gameArea.appendChild(snakeElement);
        });
    }

    function drawFood() {
        const foodElement = document.createElement('div');
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        foodElement.style.backgroundColor = 'red';
        gameArea.appendChild(foodElement);
    }

    function moveSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            food = randomFoodPosition();
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= gameArea.clientWidth || head.y < 0 || head.y >= gameArea.clientHeight) {
            return true;
        }

        for (let i = 4; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }

        return false;
    }

    function gameLoop() {
        if (checkCollision()) {
            clearInterval(gameInterval);
            gameOverDisplay.style.display = 'block';
            return;
        }

        moveSnake();
        drawSnake();
        drawFood();
    }

    function startGame() {
        snake = [{ x: 200, y: 200 }];
        direction = { x: 20, y: 0 };
        food = randomFoodPosition();
        score = 0;
        scoreDisplay.textContent = 'Score: 0';
        gameOverDisplay.style.display = 'none';
        drawSnake();
        drawFood();
        
        gameInterval = setInterval(gameLoop, 225); // Ajustar velocidad 
    }

    function changeDirection(newDirection) {
        return function() {
            const goingUp = direction.y === -20;
            const goingDown = direction.y === 20;
            const goingRight = direction.x === 20;
            const goingLeft = direction.x === -20;

            if (newDirection === 'up' && !goingDown) {
                direction = { x: 0, y: -20 };
            } else if (newDirection === 'left' && !goingRight) {
                direction = { x: -20, y: 0 };
            } else if (newDirection === 'right' && !goingLeft) {
                direction = { x: 20, y: 0 };
            } else if (newDirection === 'down' && !goingUp) {
                direction = { x: 0, y: 20 };
            }
        };
    }

    document.addEventListener('keydown', (event) => {
        const key = event.keyCode;
        if (key === 37) changeDirection('left')();
        if (key === 38) changeDirection('up')();
        if (key === 39) changeDirection('right')();
        if (key === 40) changeDirection('down')();
    });

    upButton.addEventListener('click', changeDirection('up'));
    leftButton.addEventListener('click', changeDirection('left'));
    rightButton.addEventListener('click', changeDirection('right'));
    downButton.addEventListener('click', changeDirection('down'));

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
});
