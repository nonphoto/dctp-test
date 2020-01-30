// import sync from "/web_modules/framesync.js";
import {
  stepperFrom,
  sample,
  lift,
  Behavior
} from "/web_modules/@funkia/hareactive.js";

import {
  streamFromEvent,
  render
} from "/web_modules/@funkia/hareactive/dom.js";

class Image {
  render(context) {
    context.fillStyle = "rgb(200, 0, 0)";
    context.fillRect(0, 0, 50, 50);
  }
}

class MoveImage extends Image {
  constructor(v, parent) {
    super();
    this.v = v;
    this.parent = parent;
  }

  render(context) {
    const [x, y] = this.v;
    context.save();
    context.translate(x, y);
    this.parent.render(context);
    context.restore();
  }
}

const move = (vB, imageB) => {
  return lift((v, image) => new MoveImage(v, image), vB, imageB);
};

const image = new Image();

const rect = Behavior.of(image);

const canvas = document.querySelector("canvas");
canvas.width = 400;
canvas.height = 400;
const context = canvas.getContext("2d");

const mouseBehavior = stepperFrom(
  [0, 0],
  streamFromEvent(window, "mousemove").map(({ clientX, clientY }) => [
    clientX,
    clientY
  ])
);

const mouse = sample(mouseBehavior).run();

const imageBehavior = move(mouse, rect);

render(i => {
  context.fillStyle = "rgba(255, 255, 255, 0.1)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  i.render(context);
}, imageBehavior);
