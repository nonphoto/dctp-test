import sync from "/web_modules/framesync.js";

import { Behavior } from "/web_modules/@funkia/hareactive.js";

import render, {
  move,
  moveXY,
  wiggle,
  waggle,
  scale,
  fill,
  rectangle,
  over
} from "/render.js";

render(
  ({ mouse, size }) =>
    over(
      scale(size, fill(Behavior.of("white"), rectangle)),
      moveXY(
        wiggle.map(x => x * 100),
        waggle.map(x => x * 100),
        scale(Behavior.of([10, 10]), fill(Behavior.of("red"), rectangle))
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
