const EventEmitter = require("events");

const emitter = new EventEmitter();
function handleWhy(name, ...args) {
  console.log("监听", name, ...args);
}

emitter.on("why", handleWhy); // 监听
// emitter.off("why", handleWhy); //关闭

setTimeout(() => {
  emitter.emit("why", "why1", 18, 121);
}, 2000);

