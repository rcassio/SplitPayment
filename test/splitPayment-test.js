const SplitPayment = artifacts.require("SplitPayment");

contract('SplitPayment', (accounts) => {
  let splitPayment = null;
  before(async () => {
    splitPayment = await SplitPayment.deployed();
  })

  it('Should set accounts[0] as owner', async () => {
    const owner = await splitPayment.owner();
    assert(owner == accounts[0]);
  });

  it('Should split payment', async () => {
    const recipients = [accounts[1], accounts[2], accounts[3]];
    const amounts = [40,20,30];
    const initialBalances = await Promise.all(recipients.map(async (recipient) => {
      return web3.eth.getBalance(recipient);
    }));
    await splitPayment.send(
      recipients,
      amounts,
      {from: accounts[0], value: 90}
    );
    const finalBalances = await Promise.all(recipients.map(async (recipient) => {
      return web3.eth.getBalance(recipient);
    }));
    recipients.forEach((_item, i) => {
      const finalBalance = web3.utils.toBN(finalBalances[i]);
      const initialBalance = web3.utils.toBN(initialBalances[i]);
      assert(finalBalance.sub(initialBalance).toNumber() === amounts[i]);
    });
  });

  it('Should NOT split payment if array length mismatch', async () => {
    const recipients = [accounts[1], accounts[2], accounts[3]];
    const amounts = [40,20];
    try {
      await splitPayment.send(
        recipients,
        amounts,
        {from: accounts[0], value: 90}
      );
    } catch (e) {
      assert(e.message.includes('to and amount arrays must have same length'));
      return;
    }
    assert(false);
  });

  it('Should NOT split payment if caller is not owner', async () => {
    const recipients = [accounts[1], accounts[2], accounts[3]];
    const amounts = [40,20,30];
    try {
      await splitPayment.send(
        recipients,
        amounts,
        {from: accounts[5], value: 90}
      );
    } catch (e) {
      assert(e.message.includes('only owner can send transfer'));
      return;
    }
    assert(false);
  });
});