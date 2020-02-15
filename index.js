const { getNetworkClient } = require('@colony/colony-js-client');
const { open } = require('@colony/purser-software');
const { BN } = require('web3-utils');

(async () => {

  // Step 1: Open Wallet
  // Get a wallet instance
  const wallet = await open({
    privateKey: process.env.PRIVATE_KEY,
  });

  // Check out the logs to see the wallet address
  console.log('Wallet Address:', wallet.address);

  // Step 2: Get Network Client
  // Get a network client instance
  const networkClient = await getNetworkClient('goerli', wallet);

  // Check out the logs to see the network address
  console.log('Network Address:', networkClient.contract.address);

  // Step 3: Create Token
  // Create a token
  const createTokenTransaction = await networkClient.createToken.send({
    name: 'Token',
    symbol: 'TKN',
    decimals: 18,
  });

  // Set the token address
  const tokenAddress = createTokenTransaction.meta.receipt.contractAddress;

  // Check out the logs to see the token address
  console.log('Token Address: ', tokenAddress);

  // Step 4: Create Colony
  // Create a colony
  const createColonyResponse = await networkClient.createColony.send({
    tokenAddress,
  });

  // Set the colony address
  const colonyAddress = createColonyResponse.eventData.colonyAddress;

  // Check out the logs to see the colony address
  console.log('Colony Address:', colonyAddress);

  // Step 5: Get Colony Client
  // Get a colony client instance
  const colonyClient = await networkClient.getColonyClientByAddress(colonyAddress);

  // Step 6: Mint Tokens
  // Mint tokens(MintはTokenやCoinを鋳造する、つまり増やす行為。)
  await colonyClient.tokenClient.mint.send({
    address: colonyAddress,
    amount: new BN('1000000000000000000'),
  });

  console.log('Tokens minted!');

  // Step 7: Claim Colony Funds
  // Claim colony funds
  await colonyClient.claimColonyFunds.send({
    token: tokenAddress,
  });

  console.log('Colony funds claimed!');

  // Step 8: Add Payment
  // Add a payment
  const addPaymentResponse = await colonyClient.addPayment.send({
    recipient: wallet.address,
    token: tokenAddress,
    amount: new BN('1000000000000000000'),
    domainId: 1,
  });

  // Set payment id and pot id
  const { paymentId, potId } = addPaymentResponse.eventData;

  // Check out the logs to see the payment data
  console.log('Payment Data:', { paymentId, potId });

  // Step 9: Move Funds
  // Move funds  between funding pots
  await colonyClient.moveFundsBetweenPots.send({
    fromPot: 1,
    toPot: potId,
    amount: new BN('1000000000000000000'),
    token: tokenAddress,
  });

  console.log('Funds moved to payment pot!');

  // Step 10: Finalize Payment
  await colonyClient.finalizePayment.send({ paymentId });

  console.log('Payment finalized!');

  // Step 11: Claim Payment
  await colonyClient.claimPayment.send({
    paymentId,
    token: tokenAddress,
  });

  console.log('Payment claimed!');

})()
  .then(() => process.exit())
  .catch(error => console.error(error));
