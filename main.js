import sync from "/web_modules/framesync.js";

import { Behavior } from "/web_modules/@funkia/hareactive.js";

import render, { move, scale, fill, rectangle, clear } from "/render.js";

const canvas = document.querySelector("canvas");
render(
  user =>
    clear(
      user,
      Behavior.of("white"),
      move(
        user.mouse,
        scale(Behavior.of(10), fill(Behavior.of("red"), rectangle))
      )
    ),
  canvas
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
