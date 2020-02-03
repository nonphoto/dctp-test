import {
  stepperFrom,
  sample,
  lift,
  Behavior
} from "/web_modules/@funkia/hareactive.js";

import {
  streamFromEvent,
  render as renderBehavior
} from "/web_modules/@funkia/hareactive/dom.js";

export default (onRender, selector) => {
  const pixelRatio = window.devicePixelRatio || 1;
  const canvas = document.querySelector(selector);
  canvas.width = canvas.clientWidth * pixelRatio;
  canvas.height = canvas.clientHeight * pixelRatio;

  const bounds = canvas.getBoundingClientRect();

  const context = canvas.getContext("2d");
  context.scale(pixelRatio, pixelRatio);

  const mouse = sample(
    stepperFrom(
      [0, 0],
      streamFromEvent(window, "mousemove").map(({ clientX, clientY }) => [
        clientX - bounds.x,
        clientY - bounds.y
      ])
    )
  ).run();

  const behavior = onRender({ mouse });

  renderBehavior(image => {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "black";
    image(context);
  }, behavior);
};

export const rectangle = Behavior.of(context => context.fillRect(0, 0, 1, 1));

export const scale = (sB, imageB) => {
  return lift(
    (s, image) => context => {
      context.save();
      context.scale(s, s);
      image(context);
      context.restore();
    },
    sB,
    imageB
  );
};

export const move = (vB, imageB) => {
  return lift(
    (v, image) => context => {
      const [x, y] = v;
      context.save();
      context.translate(x, y);
      image(context);
      context.restore();
    },
    vB,
    imageB
  );
};
