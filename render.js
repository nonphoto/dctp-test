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
    width,
    height
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

export const clear = ({ width, height }, cB, imageB) =>
  fill(
    cB,
    over(
      Behavior.of(context => context.fillRect(0, 0, width, height)),
      imageB
    )
  );

// export const wiggle = fromFunction(() =>
