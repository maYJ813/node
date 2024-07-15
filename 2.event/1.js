const EventEmitter = require("events");

const emitter = new EventEmitter();
function handleWhy(name, args) {
  console.log("监听", name, args);
}

emitter.on("why", handleWhy);
emitter.on("why", handleWhy);

setTimeout(() => {
  emitter.emit("why", "why1", 18);
}, 2000);
