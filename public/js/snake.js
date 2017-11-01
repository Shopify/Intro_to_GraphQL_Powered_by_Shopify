// Generated from stake.coffee.

var Game,
  game,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) {
    for (var key in parent) {
      if (__hasProp.call(parent, key)) child[key] = parent[key];
    }
    function ctor() {
      this.constructor = child;
    }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };

Game = (function(_super) {
  __extends(Game, _super);

  function Game(h, w, ps) {
    Game.__super__.constructor.apply(this, arguments);
    atom.input.bind(atom.key.LEFT_ARROW, "move_left");
    atom.input.bind(atom.key.RIGHT_ARROW, "move_right");
    atom.input.bind(atom.key.UP_ARROW, "move_up");
    atom.input.bind(atom.key.DOWN_ARROW, "move_down");
    atom.input.bind(atom.key.SPACE, "toggle_pause");
    this.height = h;
    this.width = w;
    this.pixelsize = ps;
    this.score = 0;
    this.canvas = document.getElementById("game");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;

    this.canvas.style.width = this.width * this.pixelsize + "px";
    this.canvas.style.height = this.height * this.pixelsize + "px";
    this.canvas.style.position = "relative";
    this.canvas.height = this.height * this.pixelsize;
    this.canvas.width = this.width * this.pixelsize;

    this.startGame();
  }

  Game.prototype.startGame = function() {
    var _x = Math.floor(this.width / 2);
    var _y = Math.floor(this.height / 2);
    this.snake = [[_x, _y], [--_x, _y], [--_x, _y], [--_x, _y]];
    this.dir = "";
    this.score = 0;
    this.newdir = "right";
    this.gameStarted = true;
    this.gamePaused = false;
    this.food = [];
    this.numLives = 0;
    this.hasExtraSpeed = false;
    this.hasDoublePoints = false;
    this.score = 0;
    this.last_dt = 0.0;
    this.delay = 0.08;
    this.noshow = true;
    this.gamePaused = true;
    this.tx = this.width * this.pixelsize;
    this.ty = this.height * this.pixelsize;
    this.genFood();
    this.showIntro();
  };

  Game.prototype.restartGame = function() {
    var _x = Math.floor(this.width / 2);
    var _y = Math.floor(this.height / 2);
    var _snake = [];
    for (var i = 0; i < this.snake.length; i++) {
      _snake.push([_x, _y]);
    }
    this.snake = _snake;
    this.dir = "";
    this.newdir = "right";
    this.gameStarted = true;
    this.gamePaused = false;
    this.food = [];
    this.last_dt = 0.0;
    this.delay = 0.08;
    this.noshow = true;
    this.gamePaused = true;
    this.tx = this.width * this.pixelsize;
    this.ty = this.height * this.pixelsize;
    this.genFood();
    this.showIntro();
  };

  Game.prototype.genFood = function() {
    var x, y;
    x = void 0;
    y = void 0;
    while (true) {
      x = Math.floor(Math.random() * (this.width - 1));
      y = Math.floor(Math.random() * (this.height - 1));
      if (!this.testCollision(x, y)) break;
    }
    this.food = [x, y];
  };

  Game.prototype.drawFood = function() {
    this.context.beginPath();
    this.context.arc(
      this.food[0] * this.pixelsize + this.pixelsize / 2,
      this.food[1] * this.pixelsize + this.pixelsize / 2,
      this.pixelsize / 3,
      0,
      Math.PI * 2,
      false
    );
    this.context.fill();
  };

  Game.prototype.addPowerup = function(powerUpHandle) {
    switch (powerUpHandle) {
      case "power-up-1": // Extra life
        this.numLives++;
        this.score = this.score - 100;
        break;
      case "power-up-2": // Speed Boost
        this.hasExtraSpeed = true;
        this.score = this.score - 100;
        break;
      case "power-up-3": // Double Points
        this.hasDoublePoints = true;
        this.score = this.score - 100;
        break;
      case "power-up-4": // Reset Size
        // Resets the snake size to four nodes
        this.snake = this.snake.slice(0, 4);
        this.score = Math.max(game.score - 100, 0);
        break;
    }
  };

  Game.prototype.drawSnake = function() {
    for (var i = 0; i < this.snake.length; i++) {
      x = this.snake[i][0];
      y = this.snake[i][1];
      this.context.fillRect(x * this.pixelsize, y * this.pixelsize, this.pixelsize, this.pixelsize);
    }
    $("#game-score").text("Score: " + this.score);
    this.drawPowerups();
  };

  Game.prototype.step = function() {
    var now = Date.now();
    var stepSize = this.hasExtraSpeed ? 400 : 1000;
    var dt = (now - this.last_step) / stepSize;
    this.last_step = now;
    this.update(dt);
    this.draw();
    atom.input.clearPressed();
  };

  Game.prototype.testCollision = function(x, y) {
    if (x < 0 || x > this.width - 1) return true;
    if (y < 0 || y > this.height - 1) return true;
    for (var i = 0; i < this.snake.length; i++) {
      if (x === this.snake[i][0] && y === this.snake[i][1]) {
        return true;
      }
    }
    return false;
  };

  Game.prototype.showIntro = function() {
    this.context.textAlign = "center";
    this.context.fillStyle = "#727272";
    this.context.font = "32px monospace";
    this.context.fillText("INSTRUCTIONS", this.tx / 2, this.ty / 4);

    this.context.font = "18px monospace";
    this.context.fillText("Use the arrow keys to change direction.", this.tx / 2, this.ty / 2.7);
    this.context.fillText("Press SPACE to start and pause the game.", this.tx / 2, this.ty / 2.4);
    this.context.fillText("PRESS [SPACE] TO BEGIN", this.tx / 2, this.ty - 50);
  };

  Game.prototype.endGame = function() {
    this.gameStarted = false;
    this.noshow = true;

    this.context.fillStyle = "#727272";
    this.context.textAlign = "center";
    var extraLifeImg = new Image();
    extraLifeImg.onload = function() {
      this.context.fillText(this.numLives + "x", this.tx / 2 - 35, this.ty / 2.6 + 35);
      this.context.drawImage(extraLifeImg, this.tx / 2 - 30, this.ty / 2.6);
    }.bind(this);
    extraLifeImg.src = "../images/powerup1_lg.png";

    if (this.numLives > 0) {
      this.context.font = "32px monospace";
      this.context.fillText("CONTINUE?", this.tx / 2, this.ty / 3);
      this.context.font = "18px monospace";
      this.context.fillText("You have an extra life. Try again.", this.tx / 2, this.ty / 2.6);
      this.context.fillText("PRESS [SPACE] TO CONTINUE", this.tx / 2, this.ty - 50);
    } else {
      this.context.font = "32px monospace";
      this.context.fillText("GAME OVER", this.tx / 2, this.ty / 3);
      this.context.font = "18px monospace";
      this.context.fillText("PRESS [SPACE] TO RESTART", this.tx / 2, this.ty - 50);
    }
  };

  Game.prototype.togglePause = function(turnOnPause) {
    if (turnOnPause || !this.gamePaused) {
      if (!this.gamePaused) {
        this.noshow = true;
        this.gamePaused = true;

        this.context.fillStyle = "#727272";
        this.context.font = "32px monospace";
        this.context.textAlign = "center";
        this.context.fillText("PAUSED", this.tx / 2, this.ty / 3);
        this.context.font = "18px monospace";
        this.context.fillText("Press [SPACE] to unpause the game.", this.tx / 2, this.ty - 50);
      }
    } else {
      this.gamePaused = false;
      this.noshow = false;
    }
  };

  Game.prototype.update = function(dt) {
    var x, y;
    if (atom.input.pressed("move_left")) {
      if (this.dir !== "right") this.newdir = "left";
    } else if (atom.input.pressed("move_up")) {
      if (this.dir !== "down") this.newdir = "up";
    } else if (atom.input.pressed("move_right")) {
      if (this.dir !== "left") this.newdir = "right";
    } else if (atom.input.pressed("move_down")) {
      if (this.dir !== "up") this.newdir = "down";
    } else if (atom.input.pressed("toggle_pause")) {
      if (!this.gameStarted) {
        this.eraseCanvas();
        if (this.numLives > 0) {
          this.numLives--;
          this.restartGame();
        } else {
          this.startGame();
        }
      } else {
        this.togglePause();
      }
    }
    if (this.last_dt < this.delay) {
      this.last_dt += dt;
      return;
    } else {
      this.last_dt = 0.0;
    }
    if (!this.gameStarted || this.gamePaused) return;
    x = this.snake[0][0];
    y = this.snake[0][1];
    switch (this.newdir) {
      case "up":
        y--;
        break;
      case "right":
        x++;
        break;
      case "down":
        y++;
        break;
      case "left":
        x--;
    }
    if (this.testCollision(x, y)) {
      this.endGame();
      return;
    }
    this.snake.unshift([x, y]);
    if (x === this.food[0] && y === this.food[1]) {
      if (this.hasDoublePoints) {
        this.score = this.score + 100;
      } else {
        this.score = this.score + 50;
      }
      this.genFood();
    } else {
      this.snake.pop();
    }
    this.dir = this.newdir;
  };

  Game.prototype.eraseCanvas = function() {
    this.context.fillStyle = "#f7f9f9";
    this.context.fillRect(0, 0, this.width * this.pixelsize, this.height * this.pixelsize);
    this.context.fillStyle = "#727272";
  };

  Game.prototype.drawPowerups = function() {
    $("#powerup-1").toggle(this.numLives > 0);
    $("#powerup-2").toggle(this.hasExtraSpeed);
    $("#powerup-3").toggle(this.hasDoublePoints);
  };

  Game.prototype.draw = function() {
    if (!this.noshow) {
      this.eraseCanvas();
      this.drawFood();
      this.drawSnake();
    }
  };

  return Game;
})(atom.Game);

game = new Game(30, 40, 15);

game.run();
