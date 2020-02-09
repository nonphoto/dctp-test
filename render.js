import sync from "/web_modules/framesync.js";

import {
  stepperFrom,
  sample,
  lift,
  Behavior,
  fromFunction
} from "/web_modules/@funkia/hareactive.js";

import {
  streamFromEvent,
  render as renderBehavior
} from "/web_modules/@funkia/hareactive/dom.js";

export const transform = (startRange, endRange, value) => {};

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

  const user = {
    mouse,
    size: Behavior.of([width, height])
  };

  sync.render(() => {
    const image = onRender(user).at();
    context.fillStyle = "black";
    image(context);
  }, true);
};

export const rectangle = Behavior.of(context => context.fillRect(0, 0, 1, 1));

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

export const over = (image1B, image2B) => {
  return lift(
    (image1, image2) => context => {
      image1(context);
      image2(context);
    },
    image1B,
    image2B
  );
};

export const time = fromFunction(() => performance.now());

export const wiggle = time.map(t => Math.sin(t * Math.PI * 0.001));

export const waggle = time.map(t => Math.cos(t * Math.PI * 0.001));
