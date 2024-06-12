import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const boxSize = 20;
const canvasSize = 400;

const getRandomFood = () => {
  const min = 0;
  const max = canvasSize / boxSize - 1;
  const x = Math.floor(Math.random() * (max - min + 1) + min) * boxSize;
  const y = Math.floor(Math.random() * (max - min + 1) + min) * boxSize;
  return { x, y };
};

const App = () => {
  const [snake, setSnake] = useState([
    { x: boxSize * 2, y: 0 },
    { x: boxSize, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [food, setFood] = useState(getRandomFood());
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);

  const changeDirection = (event) => {
    const { keyCode } = event;
    if (keyCode === 37 && direction !== 'RIGHT') {
      setDirection('LEFT');
    } else if (keyCode === 38 && direction !== 'DOWN') {
      setDirection('UP');
    } else if (keyCode === 39 && direction !== 'LEFT') {
      setDirection('RIGHT');
    } else if (keyCode === 40 && direction !== 'UP') {
      setDirection('DOWN');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      changeDirection(event);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    if (gameOver) {
      alert(`Game Over! Your score is: ${score}`);
    }
  }, [gameOver]);

  const drawGame = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? 'green' : 'white';
      ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
      ctx.strokeStyle = 'red';
      ctx.strokeRect(segment.x, segment.y, boxSize, boxSize);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
  };

  const moveSnake = () => {
    let newSnake = [...snake];
    let head = { ...newSnake[0] };

    if (direction === 'LEFT') head.x -= boxSize;
    if (direction === 'UP') head.y -= boxSize;
    if (direction === 'RIGHT') head.x += boxSize;
    if (direction === 'DOWN') head.y += boxSize;

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(getRandomFood());
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    // Check collision with wall
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
      setGameOver(true);
    }

    // Check collision with self
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        setGameOver(true);
      }
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
      drawGame();
    }, 1000);

    return () => clearInterval(interval);
  }, [snake, food, direction, gameOver]);

  return (
<div className="App">
<h1>Snake Ger</h1>
<canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
<p>Score: {score}</p>
</div>
);
};

export default App;
