const {
    accounts: { issuer },
    serverUrl
} = require('./config.json');

const { Server, Networks, TransactionBuilder, Keypair, Operation } = require('stellar-sdk');
const server = new Server(serverUrl);

const main = async() => {

    const issuingAccount = await server.loadAccount(issuer.publicKey);

    const txOption = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const threeshold = {
        masterweight: 0, //issuing account privatekey signature counts  for 0; no rights
        lowThreeshold: 0,
        medThreeshold: 0,
        highThreeshold: 0 //says no more transaction on this account after assign the low med and high threeshold to 0
    }

    const transaction = new TransactionBuilder(issuingAccount, txOption)
        .addOperation(Operation.setOptions(threeshold))
        .setTimeout(0)
        .build();

    transaction.sign(Keypair.fromSecret(issuer.secret))

    await server.submitTransaction(transaction);

}

main()
    .then(console.log("Locked Issuer Account Successsfully"))
    .catch(e => {
        console.log("ErrorAgain: ", e);
        throw e;
    })