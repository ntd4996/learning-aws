var sketchProc = function (processingInstance) {
  with (processingInstance) {
    size(600, 600);
    frameRate(60);
    smooth();

    Object.constructor.prototype.new = function () {
      var obj = Object.create(this.prototype);
      this.apply(obj, arguments);
      return obj;
    };

    //Gray Wolf logo
    var Logo = (function () {
      Logo = function (args) {
        this.scale = args.scale || 1.0;
        this.x = args.x || 600 * 0.5 * this.scale;
        this.y = args.y || 600 * 0.4 * this.scale;
        this.colors = {
          back: color(229, 229, 193),
          outline: color(5, 5, 5),
          from: color(102, 99, 98),
          to: color(13, 13, 13),
          text: color(138, 131, 116), //color(51, 51, 51)
        };
        this.font = args.font || createFont("Trebuchet MS");
        this.gray = {
          words: "T H Ợ  L Á I  Đ Á M  M Â Y",
          index: 0,
          timer: 0,
          delay: 2,
        };
        this.prod = {
          opacity: 0,
          y: height * 1.2,
        };
        this.img = undefined;
        this.imgs = [];
        this.splits = {
          left: undefined,
          right: undefined,
        };
        this.timer = 0;
        this.states = {
          a: {
            delay: 30,
            duration: 120,
          },
          b: {
            delay: 30,
          },
          c: {
            delay: 55,
          },
          d: {
            delay: 45,
            x: 0,
          },
        };
        this.state = "a";
        this.done = false;
        this.complete = false;
        this.hover = false;
        this.init();
      };
      Logo.prototype = {
        init: function () {
          var gx = createGraphics(600, 600, P2D);

          gx.background(0, 0);
          gx.fill(255);
          //inner
          gx.beginShape();
          gx.vertex(300, 137);
          gx.vertex(377, 150);
          gx.vertex(454, 118);
          gx.vertex(410, 213);
          gx.vertex(429, 202);
          gx.vertex(464, 279);
          gx.vertex(396, 361);
          gx.vertex(381, 316);
          gx.vertex(341, 399);
          gx.vertex(300, 443);
          gx.vertex(259, 399);
          gx.vertex(219, 316);
          gx.vertex(204, 361);
          gx.vertex(136, 279);
          gx.vertex(171, 202);
          gx.vertex(190, 213);
          gx.vertex(146, 118);
          gx.vertex(223, 150);
          gx.endShape(CLOSE);

          var shape = gx.get(115, 90, 370, 355);

          gx.noStroke();
          for (var i = 90; i <= 445; i++) {
            gx.fill(gx.lerpColor(this.colors.to, this.colors.from, i / 445));
            gx.rect(115, i, 370, 1);
          }

          gx.stroke(150, 20);
          gx.strokeWeight(1);
          for (var i = 0; i < 200; i++) {
            gx.line(
              random(115, 485),
              random(90, 445),
              random(115, 485),
              random(90, 445)
            );
          }

          gx.filter(BLUR, 2.5);

          var grad = gx.get(115, 90, 370, 355);

          grad.mask(shape);

          gx.background(this.colors.back);

          gx.background(0, 0);

          gx.noStroke();
          gx.fill(this.colors.outline);

          //outer
          gx.beginShape();
          gx.vertex(300, 126);
          gx.vertex(376, 138);
          gx.vertex(480, 92);
          gx.vertex(437, 187);
          gx.vertex(482, 283);
          gx.vertex(396, 364);
          gx.vertex(383, 344);
          gx.vertex(354, 404);
          gx.vertex(300, 444);
          gx.vertex(246, 404);
          gx.vertex(217, 344);
          gx.vertex(204, 364);
          gx.vertex(118, 283);
          gx.vertex(163, 187);
          gx.vertex(120, 92);
          gx.vertex(224, 138);
          gx.endShape(CLOSE);

          gx.image(grad, 115, 90);

          fill(this.colors.outline);
          //nose
          gx.beginShape();
          gx.vertex(300, 372);
          gx.vertex(323, 367);
          gx.vertex(320, 382);
          gx.vertex(300, 400);
          gx.vertex(280, 382);
          gx.vertex(277, 367);
          gx.endShape(CLOSE);

          //left eye
          gx.beginShape();
          gx.vertex(324, 341);
          gx.vertex(320, 268);
          gx.vertex(428, 231);
          gx.vertex(378, 290);
          gx.vertex(358, 278);
          gx.vertex(372, 280);
          gx.vertex(390, 257);
          gx.vertex(334, 277);
          gx.endShape(CLOSE);

          //right eye
          gx.beginShape();
          gx.vertex(276, 341);
          gx.vertex(280, 268);
          gx.vertex(172, 231);
          gx.vertex(222, 290);
          gx.vertex(244, 278);
          gx.vertex(228, 280);
          gx.vertex(210, 257);
          gx.vertex(266, 277);
          gx.endShape(CLOSE);

          this.img = gx.get(115, 90, 370, 355);

          //generate pieces of image
          for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
              this.imgs.push({
                img: gx.get(115 + 37 * i, 90 + 35.5 * j, 37, 35.5),
                w: 37,
                h: 35.5,
                dx: 115 + 37 * i + 18.5,
                dy: 90 + 35.5 * j + 17.75,
                x: random(-width, width * 2),
                y: random(-height, height * 2),
                angle: ~~random(3600),
              });
            }
          }
        },
        draw: function () {
          if (!this.complete) {
            pushMatrix();
            scale(this.scale);
            pushStyle();
            switch (this.state) {
              case "a":
                background(this.colors.back);

                if (this.timer++ >= this.states.a.delay) {
                  for (var i = 0; i < this.imgs.length; i++) {
                    var item = this.imgs[i];

                    item.x = lerp(item.x, item.dx, 0.1);
                    item.y = lerp(item.y, item.dy, 0.1);
                    item.angle = lerp(item.angle, 0, 0.1);

                    imageMode(CENTER);

                    pushMatrix();
                    translate(item.x, item.y - 28);
                    rotate(radians(item.angle));
                    image(item.img, 0, 0, item.w, item.h);
                    popMatrix();
                  }

                  if (this.timer >= this.states.a.duration) {
                    this.state = "b";
                    this.timer = 0;
                  }
                }
                break;
              case "b":
                background(this.colors.back);

                imageMode(CENTER);
                image(this.img, this.x / this.scale, this.y / this.scale);

                if (this.timer++ >= this.states.b.delay) {
                  textFont(this.font);
                  textAlign(CENTER, CENTER);
                  textSize(40);
                  fill(this.colors.text);

                  if (
                    this.gray.index < this.gray.words.length &&
                    this.gray.timer++ >= this.gray.delay
                  ) {
                    this.gray.index++;
                    this.gray.timer = 0;
                  }

                  text(
                    this.gray.words.substring(0, this.gray.index),
                    this.x / this.scale,
                    (this.y * 2) / this.scale
                  );

                  this.prod.opacity = constrain(this.prod.opacity + 7, 0, 255);
                  this.prod.y = ~~lerp(this.prod.y, this.y * 2.1, 0.03);
                  textSize(30);
                  fill(this.colors.text, this.prod.opacity);
                  text(
                    "K H Ô N G  N E S T  T H Ì  N E X T",
                    this.x / this.scale,
                    this.prod.y / this.scale
                  );
                }

                if (this.gray.index === this.gray.words.length) {
                  this.state = "c";
                  this.timer = 0;
                }

                break;
              case "c":
                background(this.colors.back);

                imageMode(CENTER);
                image(this.img, this.x / this.scale, this.y / this.scale);

                textFont(this.font);
                textAlign(CENTER, CENTER);
                textSize(40);
                fill(this.colors.text);
                text(
                  this.gray.words.substring(0, this.gray.index),
                  this.x / this.scale,
                  (this.y * 2) / this.scale
                );

                if (this.timer++ >= this.states.c.delay) {
                  this.prod.opacity = constrain(this.prod.opacity - 5, 0, 255);
                }

                textSize(30);
                fill(this.colors.text, this.prod.opacity);
                this.prod.y = constrain(
                  ~~lerp(this.prod.y, this.y * 2.1, 0.035),
                  530 * this.scale,
                  Infinity
                );
                text(
                  "K H Ô N G  N E S T  T H Ì  N E X T",
                  this.x / this.scale,
                  this.prod.y / this.scale
                );

                if (this.prod.opacity === 0) {
                  //get split image for next state
                  this.splits.left = get(0, 0, width / 2, height);
                  this.splits.right = get(width / 2, 0, width / 2, height);

                  this.state = "d";
                  this.timer = 0;
                }

                break;
              case "d":
                scale(1 / this.scale);

                imageMode(CORNER);

                if (this.timer++ >= this.states.d.delay) {
                  this.states.d.x = constrain(
                    this.states.d.x + 7,
                    0,
                    width / 2
                  );
                }

                image(this.splits.left, -this.states.d.x, 0);
                image(this.splits.right, width / 2 + this.states.d.x, 0);

                if (this.states.d.x >= width / 2) {
                  this.completed = true;
                }

                if (this.timer === this.states.d.delay) {
                  this.done = true;
                }

                break;
            }
            popStyle();
            popMatrix();
          }
        },
      };
      return Logo;
    })();

    //Large bug
    var Bug = (function () {
      Bug = function (args) {
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.vx = 0;
        this.vy = 0;
        this.timer = 0;
        this.speed = args.speed || 12;
        this.wings = {
          speed: 12,
          a: {
            angle: 0,
            amplitude: 8,
          },
          b: {
            angle: 0,
            amplitude: 15,
          },
          c: {
            angle: 0,
            amplitude: 15,
          },
          d: {
            angle: 0,
            amplitude: 8,
          },
        };
        this.eyes = {
          x: 0,
          y: 0,
        };
        this.head = {
          angle: 0,
        };
        this.legs = {
          a: {
            x: 360,
            y: 510,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 65,
            l2: 45,
          },
          b: {
            x: 386,
            y: 510,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 65,
            l2: 45,
          },
          c: {
            x: 422,
            y: 510,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 65,
            l2: 45,
          },
          d: {
            x: 447,
            y: 510,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 65,
            l2: 45,
          },
        };
      };
      Bug.prototype = {
        getPoint: function (Ax, Ay, Bx, By, b, c, v) {
          var t = atan2(By - Ay, Bx - Ax);
          var a = dist(Ax, Ay, Bx, By);
          var f =
            acos(
              ((Bx - Ax) * (Bx - Ax) + (By - Ay) * (By - Ay) + c * c - b * b) /
                (2 * a * b)
            ) || 0;
          var Cx = Ax + cos(t + f * v) * c || 0,
            Cy = Ay + sin(t + f * v) * c || 0;

          return { x: Cx, y: Cy };
        },
        draw: function () {
          //legs
          pushStyle();
          //legs
          stroke(56, 65, 69);
          strokeWeight(5);
          //Leg A
          line(this.legs.a.x1, this.legs.a.y1, this.legs.a.x2, this.legs.a.y2);
          line(this.legs.a.x2, this.legs.a.y2, this.legs.a.x, this.legs.a.y);

          //Leg B
          line(this.legs.b.x1, this.legs.b.y1, this.legs.b.x2, this.legs.b.y2);
          line(this.legs.b.x2, this.legs.b.y2, this.legs.b.x, this.legs.b.y);

          //Leg C
          line(this.legs.c.x1, this.legs.c.y1, this.legs.c.x2, this.legs.c.y2);
          line(this.legs.c.x2, this.legs.c.y2, this.legs.c.x, this.legs.c.y);

          //Leg D
          line(this.legs.d.x1, this.legs.d.y1, this.legs.d.x2, this.legs.d.y2);
          line(this.legs.d.x2, this.legs.d.y2, this.legs.d.x, this.legs.d.y);

          //feet
          noStroke();
          fill(56, 65, 69);
          arc(
            this.legs.a.x - 5,
            this.legs.a.y + 3,
            20,
            15,
            radians(180),
            radians(360)
          );
          arc(
            this.legs.b.x - 5,
            this.legs.b.y + 3,
            20,
            15,
            radians(180),
            radians(360)
          );
          arc(
            this.legs.c.x + 5,
            this.legs.c.y + 3,
            20,
            15,
            radians(180),
            radians(360)
          );
          arc(
            this.legs.d.x + 5,
            this.legs.d.y + 3,
            20,
            15,
            radians(180),
            radians(360)
          );
          popStyle();

          //body
          pushMatrix();
          translate(this.vx * 0.5, this.vy);

          noStroke();
          fill(24, 30, 34);
          ellipse(355, 353, 90, 90);
          ellipse(432, 353, 90, 90);
          rect(355, 308, 77, 90);
          popMatrix();

          //bug composite
          pushMatrix();
          translate(this.vx, this.vy);

          //wings
          noStroke();
          fill(250, 250, 250, 150);
          pushMatrix();
          translate(393, 348);
          rotate(radians(90 + this.wings.a.angle));
          rect(-20, 0, 40, 125, 0, 0, 50, 50);
          popMatrix();
          pushMatrix();
          translate(393, 348);
          rotate(radians(140 + this.wings.b.angle));
          rect(-20, 0, 40, 125, 0, 0, 50, 50);
          popMatrix();
          pushMatrix();
          translate(393, 348);
          rotate(radians(220 + this.wings.c.angle));
          rect(-20, 0, 40, 125, 0, 0, 50, 50);
          popMatrix();
          pushMatrix();
          translate(393, 348);
          rotate(radians(260 + this.wings.d.angle));
          rect(-20, 0, 40, 125, 0, 0, 50, 50);
          popMatrix();

          //head composite
          pushMatrix();
          translate(393, 353 + 10);
          rotate(radians(this.head.angle));
          translate(-393, -353);

          //feelers
          noFill();
          stroke(56, 65, 69);
          strokeWeight(6);
          bezier(380, 324, 355, 308, 357, 282, 357, 257);
          bezier(406, 324, 431, 308, 429, 282, 429, 257);
          noStroke();
          fill(56, 65, 69);
          ellipse(357, 257, 15, 15);
          ellipse(429, 257, 15, 15);

          //head
          noStroke();
          fill(56, 65, 69);
          ellipse(355, 353, 70, 70);
          ellipse(432, 353, 70, 70);
          rect(355, 318, 77, 70);

          //eye whites
          noStroke();
          fill(255, 255, 255);
          ellipse(355, 353, 60, 60);
          ellipse(432, 353, 60, 60);
          //eye balls
          noStroke();
          fill(23, 31, 36);
          ellipse(355 + this.eyes.x, 353 + this.eyes.y, 40, 40);
          ellipse(432 - this.eyes.x, 353 - this.eyes.y, 40, 40);
          //eye spots
          noStroke();
          fill(255, 255, 255);
          ellipse(369 + this.eyes.x, 339 + this.eyes.y, 14, 14);
          ellipse(446 - this.eyes.x, 339 - this.eyes.y, 14, 14);
          popMatrix();
          popMatrix();
        },
        update: function () {
          this.timer++;

          this.vx = sin(radians((this.timer * this.speed) / 2)) * 25;
          this.vy = cos(radians(this.timer * this.speed)) * 20;

          this.wings.speed =
            12 + constrain(tan(radians(this.timer * 0.2)) * 50, 0, 50);

          this.wings.a.angle =
            sin(radians(this.timer * this.wings.speed)) *
            this.wings.a.amplitude;
          this.wings.b.angle =
            sin(radians(this.timer * this.wings.speed)) *
            this.wings.b.amplitude;
          this.wings.c.angle =
            cos(radians(this.timer * this.wings.speed)) *
            this.wings.c.amplitude;
          this.wings.d.angle =
            cos(radians(this.timer * this.wings.speed)) *
            this.wings.d.amplitude;

          this.head.angle = cos(radians((this.timer * this.speed) / 2)) * 20;

          this.eyes.x = sin(radians((this.timer * this.speed) / 2)) * 5;
          this.eyes.y = sin(radians((this.timer * this.speed) / 2)) * 5;

          //Leg A
          this.legs.a.x1 = this.legs.a.x + this.vx;
          this.legs.a.y1 = 385 + this.vy;
          var legA = this.getPoint(
            this.legs.a.x1,
            this.legs.a.y1,
            this.legs.a.x,
            this.legs.a.y,
            this.legs.a.l1,
            this.legs.a.l2,
            1
          );
          this.legs.a.x2 = legA.x;
          this.legs.a.y2 = legA.y;

          //Leg B
          this.legs.b.x1 = this.legs.b.x + this.vx;
          this.legs.b.y1 = 385 + this.vy;
          var legB = this.getPoint(
            this.legs.b.x1,
            this.legs.b.y1,
            this.legs.b.x,
            this.legs.b.y,
            this.legs.b.l1,
            this.legs.b.l2,
            1
          );
          this.legs.b.x2 = legB.x;
          this.legs.b.y2 = legB.y;

          //Leg C
          this.legs.c.x1 = this.legs.c.x + this.vx;
          this.legs.c.y1 = 385 + this.vy;
          var legC = this.getPoint(
            this.legs.c.x1,
            this.legs.c.y1,
            this.legs.c.x,
            this.legs.c.y,
            this.legs.c.l1,
            this.legs.c.l2,
            -1
          );
          this.legs.c.x2 = legC.x;
          this.legs.c.y2 = legC.y;

          //Leg D
          this.legs.d.x1 = this.legs.d.x + this.vx;
          this.legs.d.y1 = 385 + this.vy;
          var legD = this.getPoint(
            this.legs.d.x1,
            this.legs.d.y1,
            this.legs.d.x,
            this.legs.d.y,
            this.legs.d.l1,
            this.legs.d.l2,
            -1
          );
          this.legs.d.x2 = legD.x;
          this.legs.d.y2 = legD.y;
        },
        run: function () {
          this.draw();
          this.update();
        },
      };
      return Bug;
    })();

    //Ladybug
    var Ladybug = (function () {
      Ladybug = function (args) {
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.vx = 0;
        this.vy = 0;
        this.speed = args.speed || 12;
        this.eyes = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 352,
          dir: 1,
          timer: 0,
        };
        this.head = {
          angle: 0,
        };
        this.legs = {
          a: {
            x: 132,
            y: 412,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 15,
            l2: 12,
          },
          b: {
            x: 147,
            y: 412,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 15,
            l2: 12,
          },
          c: {
            x: 159,
            y: 412,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 15,
            l2: 12,
          },
          d: {
            x: 174,
            y: 412,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            l1: 15,
            l2: 12,
          },
        };
        this.timer = 0;
        this.motion = 0;
      };
      Ladybug.prototype = {
        getPoint: function (Ax, Ay, Bx, By, b, c, v) {
          var t = atan2(By - Ay, Bx - Ax);
          var a = dist(Ax, Ay, Bx, By);
          var f =
            acos(
              ((Bx - Ax) * (Bx - Ax) + (By - Ay) * (By - Ay) + c * c - b * b) /
                (2 * a * b)
            ) || 0;
          var Cx = Ax + cos(t + f * v) * c || 0,
            Cy = Ay + sin(t + f * v) * c || 0;

          return { x: Cx, y: Cy };
        },
        draw: function () {
          //legs
          pushStyle();
          //legs
          stroke(56, 65, 69);
          strokeWeight(5);
          //Leg A
          line(this.legs.a.x1, this.legs.a.y1, this.legs.a.x2, this.legs.a.y2);
          line(this.legs.a.x2, this.legs.a.y2, this.legs.a.x, this.legs.a.y);

          //Leg B
          line(this.legs.b.x1, this.legs.b.y1, this.legs.b.x2, this.legs.b.y2);
          line(this.legs.b.x2, this.legs.b.y2, this.legs.b.x, this.legs.b.y);

          //Leg C
          line(this.legs.c.x1, this.legs.c.y1, this.legs.c.x2, this.legs.c.y2);
          line(this.legs.c.x2, this.legs.c.y2, this.legs.c.x, this.legs.c.y);

          //Leg D
          line(this.legs.d.x1, this.legs.d.y1, this.legs.d.x2, this.legs.d.y2);
          line(this.legs.d.x2, this.legs.d.y2, this.legs.d.x, this.legs.d.y);

          //feet
          noStroke();
          fill(56, 65, 69);
          pushMatrix();
          translate(this.legs.a.x - 5 + 7, this.legs.a.y + 3);
          rotate(radians(-15));
          translate(-(this.legs.a.x - 5 + 7), -(this.legs.a.y + 3));
          arc(
            this.legs.a.x - 5,
            this.legs.a.y + 3,
            15,
            15,
            radians(180),
            radians(360)
          );
          popMatrix();
          arc(
            this.legs.b.x - 5,
            this.legs.b.y + 3,
            15,
            15,
            radians(180),
            radians(360)
          );
          arc(
            this.legs.c.x + 5,
            this.legs.c.y + 3,
            15,
            15,
            radians(180),
            radians(360)
          );
          pushMatrix();
          translate(this.legs.d.x - 5 + 7, this.legs.d.y + 3);
          rotate(radians(15));
          translate(-(this.legs.d.x - 5 + 7), -(this.legs.d.y + 3));
          arc(
            this.legs.d.x + 5,
            this.legs.d.y + 3,
            15,
            15,
            radians(180),
            radians(360)
          );
          popMatrix();
          popStyle();

          //bug composite
          pushMatrix();
          translate(0, 0);
          translate(this.vx, this.vy);

          //lower body
          noStroke();
          fill(56, 65, 69);
          beginShape();
          vertex(87, 358);
          bezierVertex(89, 375, 100, 386, 118, 386);
          vertex(195, 385);
          bezierVertex(206, 386, 216, 375, 217, 358);
          endShape(CLOSE);

          //upper body (shell)
          noStroke();
          fill(235, 94, 62);
          beginShape();
          vertex(82, 360);
          bezierVertex(79, 328, 93, 298, 125, 281);
          bezierVertex(154, 271, 180, 276, 203, 297);
          bezierVertex(220, 317, 223, 339, 222, 360);
          endShape(CLOSE);

          //spots on upper body
          stroke(255);
          strokeWeight(18);
          line(100, 346, 100, 336);
          line(142, 310, 142, 300);
          line(185, 310, 185, 300);
          strokeWeight(1);

          pushMatrix();
          translate(167, 353);
          rotate(radians(this.head.angle));
          translate(-167, -353);

          //feelers
          pushStyle();
          noFill();
          stroke(56, 65, 69);
          strokeWeight(7);
          pushMatrix();
          translate(160, 338);
          rotate(radians(this.head.angle * 0.6));
          translate(-160, -338);
          bezier(160, 338, 158, 283, 158, 261, 183, 261);
          popMatrix();
          pushMatrix();
          translate(184, 336);
          rotate(radians(this.head.angle * 0.3));
          translate(-184, -336);
          bezier(184, 336, 181, 284, 184, 260, 208, 261);
          popMatrix();
          popStyle();
          //eyes
          noStroke();
          fill(56, 65, 69);
          ellipse(140, 353, 56, 56);
          ellipse(195, 353, 56, 56);
          rect(140, 325, 55, 56);

          //eye whites
          fill(255, 255, 255);
          ellipse(141, 353, 48, 48);
          ellipse(194, 353, 48, 48);

          pushMatrix();
          translate(this.eyes.x, this.eyes.y);
          //eye balls
          fill(23, 31, 36);
          ellipse(141, 353, 30, 30);
          ellipse(194, 353, 30, 30);
          fill(255, 255, 255);
          ellipse(151, 343, 10, 10);
          ellipse(204, 343, 10, 10);
          popMatrix();
          popMatrix();

          popMatrix();
        },
        update: function () {
          this.timer++;

          this.eyes.vy = 352 - sin(radians(frameCount * 2)) * 8;
          this.eyes.vx = sin(radians(frameCount * 2)) * 5;

          this.motion = constrain(
            sin(radians(this.timer * this.speed * 0.05)) * 10,
            0,
            10
          );

          this.vy = cos(radians(this.timer * this.speed)) * this.motion;

          this.head.angle =
            sin(radians(this.timer * this.speed * 0.5)) * this.motion;

          this.eyes.y =
            sin(radians(this.timer * this.speed)) * this.motion * 0.5;

          if (this.eyes.y > 0 && this.eyes.dir === 1) {
            this.eyes.dir = -1;
            this.eyes.timer = 0;
          }
          if (this.eyes.dir === -1 && this.eyes.timer++ === 30) {
            this.eyes.dir = 1;
            this.eyes.timer = 0;
          }

          this.eyes.x = constrain(
            lerp(this.eyes.x, 5 * this.eyes.dir, 0.1),
            0,
            5
          );

          //Leg A
          this.legs.a.x1 = this.legs.a.x + this.vx;
          this.legs.a.y1 = 380 + this.vy;
          var legA = this.getPoint(
            this.legs.a.x1,
            this.legs.a.y1,
            this.legs.a.x,
            this.legs.a.y,
            this.legs.a.l1,
            this.legs.a.l2,
            1
          );
          this.legs.a.x2 = legA.x;
          this.legs.a.y2 = legA.y;

          //Leg B
          this.legs.b.x1 = this.legs.b.x + this.vx;
          this.legs.b.y1 = 380 + this.vy;
          var legB = this.getPoint(
            this.legs.b.x1,
            this.legs.b.y1,
            this.legs.b.x,
            this.legs.b.y,
            this.legs.b.l1,
            this.legs.b.l2,
            1
          );
          this.legs.b.x2 = legB.x;
          this.legs.b.y2 = legB.y;

          //Leg C
          this.legs.c.x1 = this.legs.c.x + this.vx;
          this.legs.c.y1 = 380 + this.vy;
          var legC = this.getPoint(
            this.legs.c.x1,
            this.legs.c.y1,
            this.legs.c.x,
            this.legs.c.y,
            this.legs.c.l1,
            this.legs.c.l2,
            -1
          );
          this.legs.c.x2 = legC.x;
          this.legs.c.y2 = legC.y;

          //Leg D
          this.legs.d.x1 = this.legs.d.x + this.vx;
          this.legs.d.y1 = 380 + this.vy;
          var legD = this.getPoint(
            this.legs.d.x1,
            this.legs.d.y1,
            this.legs.d.x,
            this.legs.d.y,
            this.legs.d.l1,
            this.legs.d.l2,
            -1
          );
          this.legs.d.x2 = legD.x;
          this.legs.d.y2 = legD.y;
        },
        run: function () {
          this.draw();
          this.update();
        },
      };
      return Ladybug;
    })();

    //Scene images
    var backScene = (function () {
      background(0, 0);

      noStroke();
      fill(156, 156, 49);
      beginShape();
      vertex(509, 512);
      vertex(571, 512);
      bezierVertex(571, 497, 560, 487, 543, 486);
      vertex(505, 487);
      endShape(CLOSE);

      noStroke();
      fill(187, 194, 50);
      beginShape();
      vertex(509, 512);
      vertex(546, 478);
      bezierVertex(533, 464, 518, 467, 502, 478);
      endShape(CLOSE);

      fill(156, 156, 49);
      beginShape();
      vertex(192, 145);
      bezierVertex(204, 144, 217, 155, 219, 175);
      vertex(216, 512);
      vertex(192, 512);
      vertex(192, 212);
      bezierVertex(205, 206, 205, 192, 192, 186);
      endShape(CLOSE);

      fill(187, 194, 50);
      beginShape();
      vertex(227, 221);
      bezierVertex(241, 224, 250, 232, 253, 247);
      vertex(253, 512);
      vertex(229, 512);
      endShape(CLOSE);

      // large hill
      noStroke();
      fill(137, 155, 120);
      rect(205, 410, 305, 512 - 410);
      arc(205 + 152.5, 410, 305, 275, radians(180), radians(360));

      return get();
    })();
    var frontScene = (function () {
      background(0, 0);

      //leaves from left to right
      noStroke();
      fill(156, 156, 49);
      beginShape();
      vertex(60, 512);
      vertex(60, 397);
      bezierVertex(74, 395, 85, 400, 88, 422);
      vertex(88, 512);
      endShape(CLOSE);

      fill(187, 194, 50);
      beginShape();
      vertex(60, 512);
      vertex(24, 476);
      bezierVertex(37, 464, 50, 466, 64, 480);
      vertex(77, 491);
      endShape(CLOSE);

      //small hill
      noStroke();
      fill(148, 184, 156);
      arc(60 + 95, 512, 190, 205, radians(180), radians(360));

      fill(156, 156, 49);
      beginShape();
      vertex(60, 513);
      bezierVertex(65, 500, 70, 489, 84, 488);
      vertex(132, 488);
      bezierVertex(132, 497, 128, 510, 109, 512);
      endShape(CLOSE);

      return get();
    })();
    var plant = (function () {
      background(0, 0);

      //main tree
      pushStyle();
      noFill();
      stroke(187, 194, 50);
      strokeWeight(7);
      //main stem
      beginShape();
      vertex(235, 471);
      bezierVertex(266, 472, 303, 446, 303, 396);
      vertex(303, 85);
      endShape();
      //branches
      bezier(305, 174, 326, 174, 349, 152, 352, 128);
      bezier(302, 129, 280, 130, 258, 109, 256, 84);
      //strokeWeight(1);
      popStyle();

      //flowers
      //top, right, left
      fill(187, 194, 50);
      ellipse(303, 85, 30, 30);
      ellipse(352, 128, 30, 30);
      ellipse(256, 84, 30, 30);
      fill(156, 156, 49);
      arc(303, 85, 30, 30, radians(140), radians(320));
      arc(352, 128, 30, 30, radians(140), radians(320));
      arc(256, 84, 30, 30, radians(140), radians(320));
      fill(235, 94, 62);
      arc(303, 85, 30, 30, radians(230), radians(320));
      arc(352, 128, 30, 30, radians(230), radians(320));
      arc(256, 84, 30, 30, radians(230), radians(320));

      //small branches
      pushStyle();
      noFill();
      stroke(187, 194, 50);
      strokeWeight(7);
      line(248, 466, 248, 411);
      line(268, 462, 323, 462);
      line(304, 253, 344, 212);
      line(303, 215, 263, 176);
      popStyle();
      //small flowers
      noStroke();
      fill(187, 194, 50);
      rectMode(CENTER);
      rect(248, 411, 30, 60, 100);
      rect(323, 462, 60, 30, 100);
      pushMatrix();
      translate(344, 212);
      rotate(radians(45));
      rect(0, 0, 30, 60, 100);
      popMatrix();
      pushMatrix();
      translate(263, 176);
      rotate(radians(-45));
      rect(0, 0, 30, 60, 100);
      popMatrix();
      rectMode(CORNER);

      return get();
    })();

    //Controls the scene
    var Scene = (function () {
      Scene = function () {
        this.bug = Bug.new({});
        this.ladybug = Ladybug.new({});
        this.logo = Logo.new({});
      };
      Scene.prototype = {
        go: function () {
          if (this.logo.done) {
            image(backScene, 0, 0);

            pushMatrix();
            translate(229, 470);
            rotate(radians(this.ladybug.vy * 0.1));
            translate(-229, -470);
            image(plant, 0, 0);
            popMatrix();

            image(frontScene, 0, 0);

            this.ladybug.run();

            this.bug.run();
          }

          this.logo.draw();
        },
      };
      return Scene;
    })();

    var scene = Scene.new({});

    draw = function () {
      background(229, 229, 193);

      scene.go();
    };
  }
};

var canvas = document.getElementById("canvas");

//import processing

var processingInstance = new Processing(canvas, sketchProc);
