const level = require('level')
const crypto = require('crypto')
const fs = require('fs')

// 1) Create our database, supply location and options.
//    This will create or open the underlying store.
const t = level('transactions')
const w = level('wallets')
const b = level('blocks')
const iT = level('indexT')
const iW = level('indexW')
let count = 0

let i = 109000


function generateKeyPair() {
    if (fs.existsSync('GIGATREEprivateKey.pem' || 'GIGATREEpublicKey.pem')) {
        console.log("You already have keys, move your keys if you want generate new Wallet (GIGATREEpublicKey.pem & GIGATREEprivateKey.pem)")
    } else {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        })

        fs.writeFile('GIGATREEprivateKey.pem', privateKey, function (err) {
            if (err) throw err
        })

        fs.writeFile('GIGATREEpublicKey.pem', publicKey, function (err) {
            if (err) throw err
        })

        console.log('Private key : ' + privateKey)
        console.log('\nPublic key : ' + publicKey)
        console.log("Yours keys has been generated into the main folder. (GIGATREEprivateKey.pem & GIGATREEpublicKey.pem)")
    }
}
// generateKeyPair()

let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');

let keyPair = ec.genKeyPair(); // Generate random keys

let privKey = keyPair.getPrivate("hex");
let pubKey = keyPair.getPublic();
console.log(`Private key: ${privKey}`);
console.log("Public key :", pubKey.encode("hex").substr(2));
console.log("Public key (compressed):",
    pubKey.encodeCompressed("hex"));


let msg = JSON.stringify({
    go: 'couc12ou'
});
let msgHash = sha3.keccak256(msg);
let signature =
    ec.sign(msgHash, privKey, "hex");

signature = JSON.stringify(signature)
console.log(signature)


console.log(`Msg: ${msg}`);
console.log(`Msg hash: ${msgHash}`);
// console.log("Signature:", signature);

let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex")
    .getPrivate().toString(10);
let pubKeyRecovered = ec.recoverPubKey(
    hexToDecimal(msgHash), JSON.parse(signature),
    JSON.parse(signature).recoveryParam, "hex");
console.log("Recovered pubKey:",
    pubKeyRecovered.encodeCompressed("hex"));
let validSig = ec.verify(
    msgHash, JSON.parse(signature), pubKeyRecovered);
console.log("Signature valid?", validSig);


// var privateKey = fs.readFileSync('GIGATREEprivateKey.pem')
var publicKey = fs.readFileSync('GIGATREEpublicKey.pem')
// console.log(fs.readFileSync('GIGATREEpublicKey.pem'))

// var privateKey = 'cXNkZnFzZGZxc2RmcXNkZnFzZGZxc2RmcXNkZnFzZGY='
// var publicKey = 'cXNkZnFzZGZxc2RmcXNkZnFzZGZxc2RmcXNkZnFzZGY='


function makeSignatureNewWallet(publicKey, privateKey) {
    const sign = crypto.createSign('SHA256')
    sign.update(JSON.stringify({
        pubKey: publicKey,
        type: "Generate"
    }))
    sign.end()

    const signature = sign.sign(privateKey)
    console.log('Digital signature : ' + Buffer.from(signature).toString('base64'))
    return signature
}


// let newWalletRequest = {
//     pubKey: publicKey.toString('base64'),
//     type: "Generate",
//     signature: makeSignatureNewWallet(publicKey, privateKey)
// }



// console.log(newWalletRequest)



// const verify = crypto.createVerify('SHA256')
// verify.update(JSON.stringify({
//     pubKey: publicKey,
//     message: "hello, it's me from GIGATREE"
// }))
// verify.end()

// const status = verify.verify(publicKey, makeSignatureNewWallet(publicKey, privateKey))
// console.log('Digital signature status : ' + status)


// iW.put('index', JSON.parse(0), function (err) {
//     if (err) return console.log('Ooops!', err) // some kind of I/O error
//     iW.get('index', function (err, value) {
//         if (err) return console.log('Ooops!', err) // likely the key was not found
//         console.log(JSON.parse(value))
//     })
// })

// iT.put('index', JSON.parse(0), function (err) {
//     if (err) return console.log('Ooops!', err) // some kind of I/O error
//     iT.get('index', function (err, value) {
//         if (err) return console.log('Ooops!', err) // likely the key was not found
//         console.log(JSON.parse(value))
//     })
// })

// iW.get('index', function (err, value) {
//     if (err) return console.log('Ooops!', err) // likely the key was not found
//     console.log(value + " added")
// })








// console.log(createTransaction);
// expected output: [object Promise]
// t.get(8, function (err, value) {
//     if (err) return console.log('Ooops!', err) // likely the key was not found
//     console.log(value)

// })

// index verification avant insertion
function createTransaction(PubK) {
    let transactionId
    iT.get('index', function (err, value) {
        if (err) return console.log('Ooops!', err) // likely the key was not found
        console.log(JSON.parse(value))
        transactionId = JSON.parse(value) + 1
        console.log(transactionId)
        t.get(transactionId, function (err, value) {
            if (value == undefined) {
                t.put(transactionId, JSON.stringify({
                    created: Date.now(),
                    fromWalletPubK: 'from',
                    toWalletPubK: 'to',
                    id: transactionId
                }), function (err) {
                    if (err) return console.log({ error: 'error', error: 'error', error: 'error', error: 'error', error: 'error', error: 'error', }, err) // some kind of I/O error
                    iT.put('index', transactionId, function (err) {
                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                        console.log(transactionId)
                    })
                })
            }
        })
    })
}

function createWallet() {
    let walletPubK = makeid(50)
    w.put(walletPubK, JSON.stringify({
        created: Date.now(),
        value: 0,
        tHistory: []
    }), function (err) {
        if (err) return console.log({ error: 'error', error: 'error', error: 'error', error: 'error', error: 'error', error: 'error', }, err) // some kind of I/O error
        console.log(walletPubK)
        w.get(walletPubK, function (err, value) {
            if (err) return console.log('Ooops!', err) // likely the key was not found
            console.log(value + " trouvé")
        })
        iW.get('index', function (err, value) {
            if (err) return console.log('Ooops!', err) // likely the key was not found
            iW.put('index', JSON.parse(value) + 1, function (err) {
                if (err) return console.log('Ooops!', err) // some kind of I/O error
                iW.get('index', function (err, value) {
                    if (err) return console.log('Ooops!', err) // likely the key was not found
                    console.log(value + " added")
                })
            })
        })
    })
}
// setInterval(() => {
//     createWallet()
// }, 1);


function makeid(length) {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result.push(characters.charAt(Math.floor(Math.random() *
            charactersLength)));
    }
    return result.join('');
}
function getTransaction(PubK) {
    t.get(20000, function (err, value) {
        console.log(JSON.parse(value))
    })
}

// getTransaction()

// JSON.stringify({
//     count: i,
//     name: 'michal',
//     value: 10000,
//     walletId: '5d4gf65s4dfgdfg5s4dfg64s6sdfsg',
//     toWalletId: 'DGF54D6FG4S6DFGSD4F6'
// })
// setInterval(() => {

// }, 0.001);


// setInterval(() => {
//     t.get('mich140400', function (err, value) {
//         if (err) return console.log('Ooops!', err) // likely the key was not found

//         // Ta da!
//         var sd = JSON.parse(value)
//     })
// }, 10);
