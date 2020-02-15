const { getNetworkClient } = require('@colony/colony-js-client');
const { open } = require('@colony/purser-software');

(async () => {

  // Get a wallet instance (using the private key of the first ganache test account)
  const wallet = await open({
    privateKey: '0x0355596cdb5e5242ad082c4fe3f8bbe48c9dba843fe1f99dd8272f487e70efae',
  });

  // Check out the logs to see the wallet address
  console.log('Wallet Address: ', wallet.address);

  // Get a network client instance
  const networkClient = await getNetworkClient('local', wallet);

  // Check out the logs to see the network address
  console.log('Network Address: ', networkClient.contract.address);

})()
  .then(() => process.exit())
  .catch(error => console.error(error));
