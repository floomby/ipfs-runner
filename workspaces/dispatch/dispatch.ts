import { readFileSync } from "fs";
import { join } from "path";
// import net from "net";
import zmq, { socket } from "zeromq";
import * as IPFS from "ipfs-core";

import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import Transactor from "./transactor";

const web3 = new Web3("ws://127.0.0.1:8545");
// Hardhat #1
const account = web3.eth.accounts.wallet.add(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

const addresses: { dispatch: string } = JSON.parse(
  readFileSync(join(__dirname, "../../smartcontracts/addresses.json"), "utf8")
);

const abi = JSON.parse(
  readFileSync(
    join(__dirname, "../../smartcontracts/abi/Dispatch.json"),
    "utf8"
  )
);

const options = {
  filter: {
    value: [],
  },
  fromBlock: 0,
};

const sock = zmq.socket("push");
const results = zmq.socket("pull");

sock.bindSync("tcp://*:5555");
console.log("Producer bound to port 5555");
results.connect("tcp://172.17.0.1:5556");
console.log("Result subscription connected on port 5556");

const dispatchContract = new web3.eth.Contract(abi, addresses.dispatch);

class Dispatch {
  private ipfsPath: string;
  code: string;
  abi: string;
  private ipfs: IPFS.IPFS;
  private contract: Contract;
  private selector: string;
  private address: string;
  private web3: Web3;
  private dispatcher: Contract;

  constructor(
    ipfsPath: string,
    ipfs: IPFS.IPFS,
    selector: string,
    address: string,
    web3: Web3,
    dispatcher: Contract
  ) {
    this.ipfsPath = ipfsPath;
    this.ipfs = ipfs;
    this.selector = selector;
    this.address = address;
    this.web3 = web3;
    this.dispatcher = dispatcher;
  }

  async init() {
    let index = 0;
    let content: string;
    for await (const buf of this.ipfs.get(this.ipfsPath)) {
      if (index === 1) {
        content = buf.toString();
        break;
      }
      ++index;
    }

    console.log(content);
    const contentData: { code: string; abi: string } = JSON.parse(content);
    this.code = contentData.code;
    this.abi = contentData.abi;
    this.contract = new this.web3.eth.Contract(
      JSON.parse(this.abi),
      this.address
    );
    return this;
  }


  createClosure(args: any[]) {
    const txObject = this.contract.methods[this.selector](args);
    // console.dir(txObject);
    // console.log("selector is", this.selector);
    return this.dispatcher.methods.forward(this.address, txObject.encodeABI(args));
  }
}

let dispatches: Map<string, Dispatch> = new Map();
const transactor = new Transactor(account, web3);

results.on("message", async (msg) => {
  console.log("Result received", msg.toString());
  const { tx, result } = JSON.parse(msg.toString());
  const dispatch = dispatches.get(tx);
  if (dispatch) {
    const closure = dispatch.createClosure(result);
    transactor.sendTransaction(closure, () => {
      dispatches.delete(tx);
    });
  } else {
    console.log("Dispatch for transaction not found");
  }
});

const callbackApi = `[{
  "inputs": [
    {
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }
  ],
  "name": "callback",
  "outputs": [],
  "stateMutability": "nonpayable",
  "type": "function"
}]`;

(async () => {
  const ipfs = await IPFS.create();
  const { cid } = await ipfs.add(
    Buffer.from(
      JSON.stringify({
        code: `module.exports = async (axiosPath) => { return [123]; };`,
        abi: callbackApi,
      })
    )
  );
  console.log("Added to IPFS ", cid);

  dispatchContract.events.allEvents(options, async (error, event) => {
    if (error) {
      console.error(error);
    } else {
      try {
        const dispatch = new Dispatch(
          event.returnValues.ipfsPath,
          ipfs,
          event.returnValues.selector,
          event.returnValues._address,
          web3,
          dispatchContract
        );
        await dispatch.init();
        dispatches.set(event.transactionHash, dispatch);
        sock.send(
          JSON.stringify({ tx: event.transactionHash, code: dispatch.code })
        );
      } catch (error) {
        console.error(error);
      }
      console.log(event);
    }
  });
})();
