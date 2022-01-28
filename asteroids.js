var ship;
var asteroids = [];
var lasers = [];

function setup() {
    createCanvas(windowWidth - 20, windowHeight - 20);
    ship = new Ship();
    for (var i = 0; i < 10; i++) {
        asteroids.push(new Asteroid());
    }
}

function Asteroid(pos, r) {
  if (pos) {
    this.pos = pos.copy();
  } else {
    this.pos = createVector(random(width), random(height));
  }

  if (r) {
    this.r = r*0.5
  } else {
    this.r = random(15, 50);
  }
    this.velocity = p5.Vector.random2D();
    this.total = floor(random(5, 15));
    this.offset = [];
    for (var i = 0; i < this.total; i++) {
        this.offset[i] = random(-this.r * 0.5, this.r * 0.5);
    }

    this.update = function() {
        this.pos.add(this.velocity);
    }

    this.render = function() {
        push();
        stroke(0);
        fill(100);
        translate(this.pos.x, this.pos.y);
        beginShape();
        for (var i = 0; i < this.total; i++) {
            var angle = map(i, 0, this.total, 0, TWO_PI);
            var z = this.r + this.offset[i];
            var x = z * cos(angle);
            var y = z * sin(angle);
            vertex(x, y);
        }
        endShape(CLOSE);
        pop();
    }

    this.breakup = function() {
      var newA = [];
      newA[0] = new Asteroid(this.pos, this.r);
      newA[1] = new Asteroid(this.pos, this.r);
      return newA;
    }

    this.window = function() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }
}

function draw() {
    background(0);
    ship.render();
    ship.turn();
    ship.update();
    ship.window();

    for (var i = 0; i < asteroids.length; i++) {
        asteroids[i].render();
        asteroids[i].update();
        asteroids[i].window();
    }

    for (var i = lasers.length - 1; i >= 0; i--) {
        lasers[i].render();
        lasers[i].update();
        if (lasers[i].offscreen()) {
          lasers.splice(i, 1);
        } else {

        for (var j = asteroids.length - 1; j >= 0; j--) {
          if (lasers[i].hits(asteroids[j])) {
            if (asteroids[j].r > 15) {
              var newAsteroids = asteroids[j].breakup();
              asteroids = asteroids.concat(newAsteroids);
            }

            asteroids.splice(j, 1);
            lasers.splice(i, 1);
            break;
          }
        }
      }



    }
}

function keyReleased() {
    ship.setRotation(0);
    ship.boosting(false);
}

function keyPressed() {
    if (key == ' ') {
      lasers.push(new Laser(ship.pos, ship.heading));
    } else if (keyCode == RIGHT_ARROW) {
        ship.setRotation(0.1);
    } else if (keyCode == LEFT_ARROW) {
        ship.setRotation(-0.1);
    } else if (keyCode == UP_ARROW) {
        ship.boosting(true);
    }
}

function Ship() {
    this.pos = createVector(width / 2, height / 2);
    this.r = 15;
    this.heading = 0;
    this.rotation = 0;
    this.velocity = createVector(0, 0);
    this.isBoosting = false;

    this.boosting = function(b) {
        this.isBoosting = b;
    }

    this.update = function() {
        if (this.isBoosting) {
            this.boost();
        }
        this.pos.add(this.velocity);
        this.velocity.mult(0.98);
    }

    this.boost = function() {
        var force = p5.Vector.fromAngle(this.heading);
        force.mult(0.5);
        this.velocity.add(force);
    }

    this.render = function() {
        push();
        fill(32, 117, 252);
        stroke(22, 17, 152);
        translate(this.pos.x, this.pos.y)
        rotate(this.heading + PI / 2);
        triangle(-this.r, this.r, this.r, this.r, 0, -this.r)
        pop();
    }

    this.window = function() {
        if (this.pos.x > width + this.r) {
            this.pos.x = -this.r;
        } else if (this.pos.x < -this.r) {
            this.pos.x = width + this.r;
        }
        if (this.pos.y > height + this.r) {
            this.pos.y = -this.r;
        } else if (this.pos.y < -this.r) {
            this.pos.y = height + this.r;
        }
    }

    this.setRotation = function(a) {
        this.rotation = a;
    }

    this.turn = function() {
        this.heading += this.rotation;
    }
}
