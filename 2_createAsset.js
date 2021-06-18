const {
    accounts: { issuer, distributor },
    serverUrl
} = require('./config.json');

const { Server, Networks, Asset, TransactionBuilder, Keypair, Operation } = require('stellar-sdk');
const server = new Server(serverUrl);

const main = async() => {
    const issuingAccount = await server.loadAccount(issuer.publicKey);

    const niftronAsset = new Asset("NIFTRN", issuer.publicKey);

    const txOption = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const paymentOpt = {
        asset: niftronAsset,
        destination: distributor.publicKey,
        amount: "1000"
    }

    const transaction = new TransactionBuilder(issuingAccount, txOption)
        .addOperation(Operation.payment(paymentOpt))
        .setTimeout(0)
        .build();

    transaction.sign(Keypair.fromSecret(issuer.secret));

    await server.submitTransaction(transaction);
}

main()
    .then(console.log("Created Asset transferred Successsfully"))
    .catch(e => {
        console.log("ErrorAgain: ", e);
        throw e;
    })