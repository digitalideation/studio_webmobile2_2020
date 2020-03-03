export const pointer = (element) => {
  const pointer = { x: 0, y: 0, event: null };
  const bodyScrollLeft = document.body.scrollLeft;
  const elementScrollLeft = document.documentElement.scrollLeft;
  const bodyScrollTop = document.body.scrollTop;
  const elementScrollTop = document.documentElement.scrollTop;
  const offsetLeft = element.offsetLeft;
  const offsetTop = element.offsetTop;

  const onPointerMove = (event) => {
    event.preventDefault();
    let x, y;

    if (event.pageX || event.pageY) {
      x = event.pageX;
      y = event.pageY;
    } else {
      x = event.clientX + bodyScrollLeft + elementScrollLeft;
      y = event.clientY + bodyScrollTop + elementScrollTop;
    }
    x -= offsetLeft;
    y -= offsetTop;

    pointer.x = x;
    pointer.y = y;
    pointer.event = event;
  }

  element.addEventListener('pointermove', onPointerMove.bind(this), false);
  element.addEventListener('pointerdown', onPointerMove.bind(this), false);

  return pointer;
}

export const containsPoint = (rect, x, y) => {
  return !(x < rect.x ||
           x > rect.x + rect.width ||
           y < rect.y ||
           y > rect.y + rect.height);
};

export const distance = (x1, y1, x2, y2) => {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a * a + b * b);
};

export const clamp = (val, min, max) => {
  return Math.min(Math.max(val, min), max);
};
