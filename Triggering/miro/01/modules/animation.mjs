import { pointer, containsPoint, clamp } from './utils.mjs';
import Ball from './ball.mjs';

export default class Animation {
  constructor(wrapper, exitCallback) {
    this.wrapper = wrapper;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.pointer = pointer(canvas);
    this.ball = new Ball(this.pixelRatio, 40);

    this.vx = Math.random() * 10 - 5,
    this.vy = -10,
    this.bounce = -0.7,
    this.gravity = 0,
    this.isPointerDown = false,
    this.oldX = 0;
    this.oldY = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.isActive = true;

    this.exitDir = 'leftright';
    this.exitCallback = exitCallback;

    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);

    this.init();
  }

  init() {
    this.wrapper.appendChild(this.canvas);

    // centering ball on canvas
    this.ball.x = this.canvas.width / 2;
    this.ball.y = this.canvas.height / 2;

    this.eventBindings();

    window.requestAnimationFrame(this.render);
  }

  eventBindings() {
    window.addEventListener('resize', this.resize, false);
    window.addEventListener('pointerdown', this.onPointerDown, false);
    this.resize()
  }

  onPointerDown(e) {
    console.log(this.ball.bounds, this.pointer.x * this.pixelRatio);
    if (containsPoint(this.ball.bounds, this.pointer.x * this.pixelRatio, this.pointer.y * this.pixelRatio)) {
      this.isPointerDown = true;
      this.oldX = this.ball.x;
      this.oldY = this.ball.y;
      this.offsetX = (this.ball.x - (this.pointer.x * this.pixelRatio)) / this.pixelRatio;
      this.offsetY = (this.ball.y - (this.pointer.y * this.pixelRatio)) / this.pixelRatio;
      this.canvas.addEventListener('pointerup', this.onPointerUp, false);
      this.canvas.addEventListener('pointermove', this.onPointerMove, false);
    }
  }
  onPointerUp() {
    this.isPointerDown = false;
    this.canvas.removeEventListener('pointerup', this.onPointerUp, false);
    this.canvas.removeEventListener('pointermove', this.onPointerMove, false);
  }
  onPointerMove() {
    this.ball.x = (this.pointer.x + this.offsetX) * this.pixelRatio;
    this.ball.y = (this.pointer.y + this.offsetY) * this.pixelRatio;
  }

  trackVelocity() {
    this.vx = this.ball.x - this.oldX;
    this.vy = this.ball.y - this.oldY;
    this.oldX = this.ball.x;
    this.oldY = this.ball.y;
  }

  checkBoundaries () {
    const left = 0;
    const right = this.canvas.width;
    const top = 0;
    const bottom = this.canvas.height;

    this.vy += this.gravity;
    this.ball.x += this.vx;
    this.ball.y += this.vy;

    //boundary detect and bounce
    if (this.ball.x > right) {
      this.exit('right');
      // if (this.exitDir === 'right' || this.exitDir === 'leftright') {
      // } else {
      //   this.ball.x = right - this.ball.radius;
      //   this.vx *= this.bounce;
      // }
    } else if (this.ball.x < left) {
      this.exit('left');
      // if (this.exitDir === 'left' || this.exitDir === 'leftright') {
      // } else {
      //   this.ball.x = left + this.ball.radius;
      //   this.vx *= this.bounce;
      // }
    }
    if (this.ball.y + this.ball.radius > bottom) {
      this.ball.y = bottom - this.ball.radius;
      this.vy *= this.bounce;
    } else if (this.ball.y - this.ball.radius < top) {
      this.ball.y = top + this.ball.radius;
      this.vy *= this.bounce;
    }
  }

  enter(data) {
    if (data.direction === 'right') {
      this.ball.x = 0;
    } else {
      this.ball.x = this.canvas.width;
    }
    this.ball.y = clamp(data.ball.y, this.ball.radius, this.canvas.height - this.ball.radius);
    this.vx = data.vx;
    this.vy = data.vy;
    this.isActive = true;
  }

  exit(dir) {
    this.isActive = false;
    const data = {
      direction: dir,
      ball: this.ball,
      vx: this.vx,
      vy: this.vy,
    };
    this.exitCallback(data);
  }

  render() {
    window.requestAnimationFrame(this.render);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (!this.isActive) return;

    if (this.isPointerDown) {
      this.trackVelocity();
    } else {
      this.checkBoundaries();
    }
    this.ball.draw(this.context);
  }

  resize() {
    const width = this.wrapper.offsetWidth;
    const height = this.wrapper.offsetHeight;
    this.canvas.width = width * this.pixelRatio;
    this.canvas.height = height * this.pixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }

  set exitDirection(direction) {
    this.exitDir = direction
  }
}
