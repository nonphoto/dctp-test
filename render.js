import sync from "/web_modules/framesync.js";

import { interpolate } from "/web_modules/@popmotion/popcorn.js";

import {
  stepperFrom,
  sample,
  lift,
  Behavior,
  fromFunction
} from "/web_modules/@funkia/hareactive.js";

import { streamFromEvent } from "/web_modules/@funkia/hareactive/dom.js";

export const lerp = (startRangeB, endRangeB, valueB) =>
  lift(
    (startRange, endRange, value) => interpolate(startRange, endRange)(value),
    startRangeB,
    endRangeB,
    valueB
  );

export default (onRender, canvas) => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  canvas.width = width * pixelRatio;
  canvas.height = height * pixelRatio;

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

  const size = Behavior.of([width, height]);

  const xRange = Behavior.of([0, width]);

  const yRange = Behavior.of([0, height]);

  const user = {
    mouse,
    size,
    xRange,
    yRange
  };

  const imageBehavior = onRender(user);

  sync.render(() => {
    const image = imageBehavior.at();
    context.fillStyle = "black";
    image(context);
  }, true);
};

export const shape = (name, ...args) =>
  Behavior.of(context => {
    context.beginPath();
    context[name](...args);
    context.fill();
  });

export const square = shape("rect", 0, 0, 1, 1);

export const circle = shape("ellipse", 0, 0, 0.5, 0.5, 0, 0, 2 * Math.PI);

export const fill = (cB, imageB) => {
  return lift(
    (c, image) => context => {
      context.save();
      context.fillStyle = c;
      image(context);
      context.restore();
    },
    cB,
    imageB
  );
};

export const scale = (vB, imageB) => {
  return lift(
    (v, image) => context => {
      const [w, h] = v;
      context.save();
      context.scale(w, h);
      image(context);
      context.restore();
    },
    vB,
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

export const moveXY = (xB, yB, imageB) => {
  return lift(
    (x, y, image) => context => {
      context.save();
      context.translate(x, y);
      image(context);
      context.restore();
    },
    xB,
    yB,
    imageB
  );
};

export const over = (...behaviors) => {
  return lift(
    (...images) => context => {
      images.forEach(image => image(context));
    },
    ...behaviors
  );
};

export const time = fromFunction(() => performance.now());

export const wiggle = time.map(t => Math.sin(t * Math.PI * 0.001));

export const waggle = time.map(t => Math.cos(t * Math.PI * 0.001));
