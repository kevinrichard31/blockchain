// const level = require('level')
const crypto = require('crypto')
const fs = require('fs')
const bs58 = require('bs58')


let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');
// 1) Create our database, supply location and options.
//    This will create or open the underlying store.
// const t = level('transactions')
// const w = level('wallets')
// const b = level('blocks')
let count = 0

let i = 109000


// READING GIGATREE KEYS
// var privateKey = fs.readFileSync('GIGATREEprivateKey.pem')
// var publicKey = fs.readFileSync('GIGATREEpublicKey.pem')
// Function to make a signature, you need to create a signature
// before to send the request, nodes will verify if you publickey exist



// let newWalletRequest = {
//     pubKey: publicKey,
//     type: "Generate",
//     signature: makeSignatureNewWallet(publicKey, privateKey)
// }







// CRYPTO ELLIPTIC gigatree process verification key pairs




let publicKey
let privateKey

// 



module.exports.generateKeyPair = function () {
    if (fs.existsSync('GIGATREEprivateKey.pem' || 'GIGATREEpublicKey.pem')) {
        console.log("You already have keys, move your keys if you want generate new Wallet (GIGATREEpublicKey.pem & GIGATREEprivateKey.pem)")
        privateKey = fs.readFileSync('GIGATREEprivateKey.pem')
        publicKey = fs.readFileSync('GIGATREEpublicKey.pem')
    } else {
        let keyPair = ec.genKeyPair(); // Generate random keys

        let privKey = keyPair.getPrivate("hex");
        console.log(privKey)
        let pubKey = keyPair.getPublic();
        console.log(`Private key: ${privKey}`);
        console.log("pubkeylll")
        console.log("Public key :", pubKey.encode("hex").substr(2));
        console.log("Public key (compressed):",
            pubKey.encodeCompressed("hex"));
        const bytes = Buffer.from(pubKey.encodeCompressed("hex"), 'hex')
        const addressPubK = bs58.encode(bytes)
        console.log(addressPubK)


        fs.writeFile('GIGATREEprivateKey.pem', privKey, function (err) {
            if (err) throw err
        })

        fs.writeFile('GIGATREEpublicKey.pem', addressPubK, function (err) {
            if (err) throw err
        })

        console.log("Yours keys has been generated into the main folder. (GIGATREEprivateKey.pem & GIGATREEpublicKey.pem)")
    }
};
// generateKeyPair()





var WebSocketClient = require('websocket').client;
const { connection } = require('websocket');

// client.on('connectFailed', function (error) {
//     console.log('Connect Error: ' + error.toString());
// });

// client.on('connect', function (connection) {
//     console.log('WebSocket Client Connected');
//     connection.on('error', function (error) {
//         console.log("Connection Error: " + error.toString());
//     });
//     connection.on('close', function () {
//         console.log('echo-protocol Connection Closed');
//     });
//     connection.on('message', function (message) {
//         if (message.type === 'utf8') {

//             console.log(message.utf8Data);
//         }
//     });

//     console.log(fs.readFileSync('GIGATREEpublicKey.pem').toString('utf8'));
//     connection.sendUTF(JSON.stringify(fs.readFileSync('GIGATREEpublicKey.pem').toString('utf8')))
// });


// client.connect('ws://localhost:8080/', 'echo-protocol');

// Add the wallet to blockchain by signing a message
module.exports.createWallet = function () {

    console.log(fs.readFileSync('GIGATREEprivateKey.pem').toString('utf8'))
    client.on('connect', function (connection) {
        console.log("Connected to GIGANETWORK")
        let msg = JSON.stringify({
            type: 'createWallet',
            date: Date.now()
        });
        let msgHash = sha3.keccak256(msg);
        let signature =
            ec.sign(msgHash, fs.readFileSync('GIGATREEprivateKey.pem').toString('utf8'), "hex");

        signature = JSON.stringify(signature)
        console.log(signature)
        prepareData = {
            type: "createWallet",
            walletToVerify: msg,
            signature: signature,
            date: Date.now()
        }
        // console.log(JSON.stringify(prepareData))

        connection.sendUTF(JSON.stringify(prepareData))



        console.log("Request sent, waiting response from the server")
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log(message.utf8Data);
            }
        });
        setTimeout(() => {
            connection.close()
        }, 1000);
    })
};

let client = new WebSocketClient();
client.connect('ws://localhost:8080/', 'echo-protocol');

module.exports = {
    signMessage(message) {

        let msgHash = sha3.keccak256(message);
        let signature =
            ec.sign(msgHash, fs.readFileSync('GIGATREEprivateKey.pem').toString('utf8'), "hex");
    
        signature = JSON.stringify(signature)
    
        return signature;
    }
}

// module.exports = {
//     super(){
//         console.log('boifdig')
//     }
// }


// signWalletAndConfirmCreation()
module.exports.sendTransaction = function (value, toPubK) {
    if (value && toPubK) {
        client.on('connect', function (connection) {
            console.log("Connected to GIGANETWORK")
            // replace amount by amount to send
            let message = JSON.stringify({
                amountToSend: JSON.parse(value),
                toPubK: toPubK,
                type: 'sendTransaction',
                date: Date.now()
            });
            console.log(message)
            
            prepareData = {
                type: "sendTransaction",
                message: message,
                signature: signMessage(message)
            }
            // console.log(JSON.stringify(prepareData))

            connection.sendUTF(JSON.stringify(prepareData))
            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    console.log(message.utf8Data);
                }
            });
            setTimeout(() => {
                connection.close()
            }, 1000);
        });
    } else {
        console.log("missing params : value and/or recipient public key")
        client.on('connect', function (connection) {
            connection.close()
        });
    }
};



module.exports.becomeStacker = function () {
    let message = JSON.stringify({
        type: 'becomeStacker',
        date: Date.now()
    });

    let prepareData = {
        type: "becomeStacker",
        message: message,
        signature: signMessage(message),
        date: Date.now()
    }
    client.on('connect', function (connection) {
        connection.sendUTF(JSON.stringify(prepareData))
        // connection.close()
    })

    
}