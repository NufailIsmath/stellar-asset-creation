const {
    accounts: { issuer, distributor },
    serverUrl
} = require('./config.json');

const { Server, Networks, Asset, TransactionBuilder, Keypair, Operation } = require('stellar-sdk');
const server = new Server(serverUrl);


const main = async() => {

    const distributionAccount = await server.loadAccount(distributor.publicKey);

    const niftronAsset = new Asset("NIFTRN", issuer.publicKey);

    const txOption = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const manageSellOfferOpt = {
        selling: niftronAsset,
        buying: Asset.native(),
        amount: "1000",
        price: "1.00000000"
    }

    const transaction = new TransactionBuilder(distributionAccount, txOption)
        .addOperation(Operation.manageSellOffer(manageSellOfferOpt))
        .setTimeout(0)
        .build();

    transaction.sign(Keypair.fromSecret(distributor.secret))

    await server.submitTransaction(transaction);
}

main()
    .then(console.log("TOken Distriution added Successsfully"))
    .catch(e => {
        console.log("ErrorAgain: ", e);
        throw e;
    })