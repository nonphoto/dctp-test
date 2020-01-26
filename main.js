import sync from "/web_modules/framesync.js";

console.log("Hello, world!");

sync.update(({ timestamp }) => void console.log(timestamp), true);
