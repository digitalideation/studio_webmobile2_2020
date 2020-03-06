import Ball from "./ball.mjs";

export default class Scene {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.devicePixelRatio = window.devicePixelRatio;
    this.ball = new Ball(this.devicePixelRatio * 30, '#f0b324');
    this.init();
  }

  init() {
    this.wrapper.prepend(this.canvas);
    this.resize();
    window.addEventListener('resize', this.resize, false);
    this.drawLoop();
  }

  drawLoop() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    window.requestAnimationFrame(this.drawLoop.bind(this));
    this.ball.draw(this.context);
  }
  
  resize() {
    const width = this.wrapper.offsetWidth;
    const height = this.wrapper.offsetHeight;
    this.canvas.width = width * devicePixelRatio;
    this.canvas.height = height * devicePixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  }
};