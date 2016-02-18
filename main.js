
function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};

// Circle code starts here

function Circle(game) {
    this.player = 1;
    this.radius = 20;
    this.colors = ["Red", "Green", "Blue", "White"];
    this.color = 2;
    Entity.call(this, game, this.radius + Math.random() * (800 - this.radius * 2), this.radius + Math.random() * (800 - this.radius * 2));
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
}

Circle.prototype = new Entity();
Circle.prototype.constructor = Circle;

Circle.prototype.collideRight = function () {
    var x = this.x + this.radius;
    var y = this.y + this.radius;
    return x > 800 ||
    ( x > 200 && x < 300 ) ||
    ( y > 200 && y < 300 );
};

Circle.prototype.collideLeft = function () {
    var x = this.x - this.radius;
    var y = this.y - this.radius;
    return x < 0 ||
    ( x > 350 && x < 450 ) ||
    ( y > 350 && y < 450 );
};

Circle.prototype.collideBottom = function () {
    var x = this.x + this.radius;
    var y = this.y + this.radius;
    return y > 800 ||
    ( x > 350 && x < 450 ) ||
    ( y > 350 && y < 450 );
};

Circle.prototype.collideTop = function () {
    var x = this.x - this.radius;
    var y = this.y - this.radius;
    return x < 0 ||
    ( x > 350 && x < 450 ) ||
    ( y > 350 && y < 450 );
};

Circle.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Circle.prototype.update = function () {
    Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

    if (this.collideLeft() || this.collideRight()) {
        this.velocity.x = -this.velocity.x;
    }
    if (this.collideTop() || this.collideBottom()) {
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {
            var temp = this.velocity;
            this.velocity = ent.velocity;
            ent.velocity = temp;
        };
    };

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent) {
            var dist = distance(this, ent);
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            this.velocity.x += difX / (dist * dist) * acceleration;
            this.velocity.y += difY / (dist * dist) * acceleration;

            var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > maxSpeed) {
                var ratio = maxSpeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            };
        };
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;
}

Circle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.colors[this.color];
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

var friction = 1;
var acceleration = 10000;
var maxSpeed = 1250;

// Obstacle code starts here

function Obstacle(game) {
    this.colors = ["Green", "Blue", "White", "Black"];
    this.color = 3;
    Entity.call(this, game, 300, 350);
    this.velocity = { x: 0, y: 0 };
}

Obstacle.prototype = new Entity();
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.draw = function (ctx) {
    ctx.fillStyle = this.colors[this.color];
    ctx.fillRect(350, 350, 100, 100);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/960px-Blank_Go_board.png");
ASSET_MANAGER.queueDownload("./img/black.png");
ASSET_MANAGER.queueDownload("./img/white.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    for (var i = 1; i <= 10; i++) {
        var circle = new Circle(gameEngine);
        gameEngine.addEntity(circle);
    };

    var obstacle = new Obstacle(gameEngine);
    gameEngine.addEntity(obstacle);

    gameEngine.init(ctx);
    gameEngine.start();
});
