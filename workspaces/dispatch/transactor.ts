import Web3 from "web3";
import { AddedAccount } from "web3-core";

class Transactor {
  private account: AddedAccount;
  private web3: Web3;
  private queue: Array<{ transactable: any; callback: () => void }> = [];

  constructor(account: AddedAccount, web3: Web3) {
    this.account = account;
    this.web3 = web3;
    this.processQueue();
  }

  sendTransaction(transactable: any, callback: () => void) {
    this.queue.push({ transactable, callback });
  }

  // TODO: This is not very robust and will break if transactions get stalled stalled transactions
  private async processQueue() {
    const transactable = this.queue.shift();
    if (transactable) {
      const gas = await transactable.transactable.estimateGas({
        from: this.account.address,
      });
      await transactable.transactable.send({ from: this.account.address, gas });
      transactable.callback();
      this.processQueue();
    } else {
      setTimeout(() => this.processQueue(), 1000);
    }
  }
}

export default Transactor;
