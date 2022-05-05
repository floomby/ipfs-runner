import { NodeVM } from "vm2";
import { join } from "path";
import { readFileSync } from "fs";
import zmq from "zeromq";

const axiosPath = join(__dirname, "node_modules/axios");

const sock = zmq.socket("pull");
sock.connect("tcp://host.docker.internal:5555");
console.log("Worker connected to port 5555");

const results = zmq.socket("push");
results.bindSync("tcp://*:5556");
console.log("Result publishing bound to port 5556");

sock.on("message", (msg) => {
  try {
    const vm = new NodeVM({
      sandbox: {},
      require: {
        external: ["axios"],
        builtin: ["url", "crypto"],
        root: join(__dirname, "node_modules"),
      },
    });
    const { code, tx } = JSON.parse(msg.toString());
    console.log("Running %s", code);
    vm.run(code)(axiosPath)
      .then((result: []) => {
        console.log(result);
        results.send(JSON.stringify({ tx, result }));
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
  }
});
