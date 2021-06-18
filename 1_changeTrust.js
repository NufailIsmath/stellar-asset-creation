const {
    accounts: { issuer, distributor },
    serverUrl
} = require('./config.json');

const { Server, Networks, Asset, TransactionBuilder, Keypair, Operation } = require('stellar-sdk');
const server = new Server(serverUrl);

const main = async() => {

    const txOption = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const distributionAccount = await server.loadAccount(distributor.publicKey);

    const niftronAsset = new Asset("NIFTRN", issuer.publicKey);

    const changTrustOpts = {
        asset: niftronAsset,
        limit: "1000"
    }

    const transaction = new TransactionBuilder(distributionAccount, txOption)
        .addOperation(Operation.changeTrust(changTrustOpts))
        .setTimeout(100)
        .build();

    transaction.sign(Keypair.fromSecret(distributor.secret));

    await server.submitTransaction(transaction);
}

main()
    .then(console.log("Changed Trust Successfully with asset creation"))
    .catch(e => {
        console.log("ErrorAgain: ", e);
        throw e;
    })