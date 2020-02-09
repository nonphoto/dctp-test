import sync from "/web_modules/framesync.js";

import { Behavior } from "/web_modules/@funkia/hareactive.js";

import render, {
  move,
  moveXY,
  wiggle,
  waggle,
  scale,
  fill,
  square,
  over,
  lerp
} from "/render.js";

const b = a => Behavior.of(a);

render(
  ({ mouse, size, xRange, yRange }) =>
    over(
      scale(size, fill(b("white"), square)),
      moveXY(
        lerp(b([-1, 1]), xRange, wiggle),
        lerp(b([-1, 1]), yRange, waggle),
        scale(b([100, 100]), fill(b("red"), square))
      )
    ),
  document.querySelector("canvas")
);

/*
const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

const box = document.querySelector("#box");

sync.update(() => {
  box.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
}, true);
*/
