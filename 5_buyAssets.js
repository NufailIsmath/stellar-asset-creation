const {
    accounts: { issuer, distributor, buyer },
    serverUrl
} = require('./config.json');

const { Server, Networks, Asset, TransactionBuilder, Keypair, Operation } = require('stellar-sdk');
const server = new Server(serverUrl);


const main = async() => {

    const buyerAccount = await server.loadAccount(buyer.publicKey);

    const niftronAsset = new Asset("NIFTRN", issuer.publicKey);

    const txOption = {
        fee: await server.fetchBaseFee(),
        networkPassphrase: Networks.TESTNET
    }

    const changeTrustOption = {
        asset: niftronAsset,
        limit: "500"
    }

    const manageSellOfferOpt = {
        selling: Asset.native(),
        buying: niftronAsset,
        amount: "1",
        price: "1"
    }

    const transaction = new TransactionBuilder(buyerAccount, txOption)
        .addOperation(Operation.changeTrust(changeTrustOption))
        .addOperation(Operation.manageSellOffer(manageSellOfferOpt))
        .setTimeout(0)
        .build();

    transaction.sign(Keypair.fromSecret(buyer.secret));

    await server.submitTransaction(transaction)
}

main()
    .then(console.log("TOken selling added Successsfully"))
    .catch(e => {
        console.log("ErrorAgain: ", e);
        throw e;
    })