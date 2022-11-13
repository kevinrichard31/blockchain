// const level = require('level')
const crypto = require('crypto')
const fs = require('fs')
const bs58 = require('bs58')
let process = require('process');
let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');

// 1) Create our database, supply location and options.
//    This will create or open the underlying store.

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
const { BlockList } = require('net');

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



// Add the wallet to blockchain by signing a message
module.exports.createWallet = function () {
    let client = new WebSocketClient();
    client.connect('ws://localhost:8080/', 'echo-protocol');
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



// let client = new WebSocketClient();
// client.connect('ws://192.168.1.13:8081/', 'echo-protocol');

function signMessage(message) {

    let msgHash = sha3.keccak256(message);
    let signature =
        ec.sign(msgHash, fs.readFileSync('GIGATREEprivateKey.pem').toString('utf8'), "hex");

    signature = JSON.stringify(signature)

    return signature;
}
module.exports.signMessage = signMessage

function sendBecomeStacker() {
    let client = new WebSocketClient();
    client.connect('ws://localhost:8080/', 'echo-protocol');
    client.on('connect', function (connection) {
        // Récupération de la connection local pour réutilisation pour ne pas avoir à se reconnecter
        localconnect = connection
        console.log('becommme')
        let message = JSON.stringify({
            type: 'becomeStacker',
            date: Date.now()
        });

        let prepareData = {
            type: "becomeStacker",
            message: message,
            signature: signMessage(message)
        }

        connection.sendUTF(JSON.stringify(prepareData))

    });

    // connection.close()
    // walletest à supprimer delete deleted

    // fin à a supprimer
}
module.exports.sendBecomeStacker = sendBecomeStacker

// 78.201.245.32

let peerList = ["78.201.245.32:8080"]
function getPeerList(){
    let client = new WebSocketClient();
    client.connect('ws://78.201.245.32:8080/', 'echo-protocol');
    client.on('connect', function (connection) {
        // Récupération de la connection local pour réutilisation pour ne pas avoir à se reconnecter

        let prepareData = {
            type: "getPeerList"
        }
        connection.sendUTF(JSON.stringify(prepareData))
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                // let result = JSON.parse(message.utf8Data)
                console.log(message)
                connection.close()
            }
        });
    });
}
// getPeerList()
function getIndex() {
    const level = require('level')
    const wallets = level('wallets')
    const blocks = level('blocks')
    let index
    let client = new WebSocketClient();
    client.connect('ws://78.201.245.32:8080/', 'echo-protocol');
    client.on('connect', function (connection) {
        // Récupération de la connection local pour réutilisation pour ne pas avoir à se reconnecter

        let prepareData = {
            type: "getIndex"
        }
        connection.sendUTF(JSON.stringify(prepareData))
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                let indexFromPeer = JSON.parse(message.utf8Data)
                console.log("INDEX DU PEER")
                console.log(indexFromPeer)

                blocks.get('index', function (err, value) {
                    console.log("MON INDEX")
                    console.log(value)
                    if (value == undefined || indexFromPeer > value) {
                        getBlocks(value, indexFromPeer, level, wallets, blocks)
                        connection.close()
                    }
                })

            }
        });
    });
}

module.exports.getIndex = getIndex


// Passer en paramètre la valeur de son index pour récupérer des blocks distants manquants
function getBlocks(myIndex, indexPeer, level, wallets, blocks) {

    console.log("FONCTION GET BLOCKS")
    console.log(myIndex)
    console.log(indexPeer)
    let client = new WebSocketClient();
    client.connect('ws://78.201.245.32:8080/', 'echo-protocol');
    client.on('connect', function (connection) {
        // Récupération de la connection local pour réutilisation pour ne pas avoir à se reconnecter
        let prepareData = {
            type: "getBlocks",
            myIndex: myIndex,
            indexNeeded: indexPeer
        }
        let newArr = []

        if (myIndex == undefined) {
            for (let index = 0; index <= indexPeer; index++) {
                newArr.push(index)
                console.log(newArr)
                prepareData.getBlocks = newArr

            }
            connection.sendUTF(JSON.stringify(prepareData))
        } else if (myIndex >= 0) {
            // for (let index = myIndex + 1; index <= indexPeer; index++) {
            //     newArr.push(index)
            //     prepareData.getBlocks = newArr

            //     console.log(newArr)
            // }

            for (let index = myIndex; index < indexPeer; index++) {
                newArr.push(JSON.parse(index) + 1)
                prepareData.getBlocks = newArr

                console.log(newArr)
            }

            console.log(prepareData)
            connection.sendUTF(JSON.stringify(prepareData))
        }

        connection.on('message', function (message) {

            if (message.type === 'utf8') {
                let result = JSON.parse(message.utf8Data)
                // console.log(JSON.parse(result))




                // LOGIQUE 0 BLOCKS
                if (JSON.parse(result[0]).blockInfo.blockNumber == 0) {
                    // On vérifie l'intégrité du bloc avec l'ancien hash + formule hashage block
                    for (let index = 0; index < result.length; index++) {
                        setTimeout(() => {
                            const element = JSON.parse(result[index])
                            if (element.blockInfo.blockNumber == 0) {
                                blocks.put(0, JSON.stringify(element), function (err, value) {
                                    console.log("block 0 ajouté")
                                })
                            }
                            if (element.blockInfo.blockNumber > 0) {
                                let previousHash = ""
                                // let hash = sha3.keccak256(blockParsed.blocks + blockParsed.blockInfo.previousHash)
                                previousHash = JSON.parse(result[index - 1]).blockInfo.hash
                                // console.log(result[index-1])
                                // console.log(element.blockInfo.blockNumber)
                                console.log("**********HASH DU BLOCK**********")
                                console.log(element.blockInfo.hash)
                                // console.log(sha3.keccak256(element.blocks + previousHash))
                                let test = sha3.keccak256(element.blocks + previousHash)
                                console.log(test == element.blockInfo.hash)
                                // console.log(result.length)
                                if (test == element.blockInfo.hash) {
                                    blocks.put(element.blockInfo.blockNumber, JSON.stringify(element), function (err, value) {
                                        console.log("block ajouté N°" + element.blockInfo.blockNumber)
                                    })
                                }
                                if (index == result.length - 1) {
                                    console.log("Boucle terminée avec succès, mise à jour de l'index ...")
                                    setTimeout(() => {
                                        blocks.put("index", index, function (err, value) {
                                            console.log("index mis à jour " + index)
                                        })
                                    }, 1000);
                                }
                            }
                        }, index * 100);

                    }
                } else {
                    console.log("BLOCKS ARE ALREADY ADDED, ADD NEW PROCESS")
                    blocks.get(JSON.parse(result[0]).blockInfo.blockNumber - 1, function (err, resultLastBlock) {
                        // console.log(JSON.parse(resultLastBlock))
                        let lastBlock = JSON.parse(resultLastBlock)
                        result.forEach((element, index) => {
                            if (index == 0) {
                                let parsedBlock = JSON.parse(element)
                                // console.log(parsedBlock)

                                let test = sha3.keccak256(parsedBlock.blocks + lastBlock.blockInfo.hash)
                                if (test == parsedBlock.blockInfo.hash) {
                                    blocks.put(parsedBlock.blockInfo.blockNumber, JSON.stringify(parsedBlock), function (err, value) {
                                        console.log("block ajouté " + parsedBlock.blockInfo.blockNumber)
                                    })
                                }
                                if (index == result.length - 1) {
                                    console.log("Boucle terminée on execute cette fonction")
                                    blocks.put("index", parsedBlock.blockInfo.blockNumber, function (err, value) {
                                        console.log("index mis à jour " + parsedBlock.blockInfo.blockNumber)
                                    })
                                }
                            } else {
                                let parsedBlock = JSON.parse(element)
                                let previousHash = JSON.parse(result[index - 1]).blockInfo.hash
                                let test = sha3.keccak256(parsedBlock.blocks + previousHash)
                                if (test == parsedBlock.blockInfo.hash) {
                                    blocks.put(parsedBlock.blockInfo.blockNumber, JSON.stringify(parsedBlock), function (err, value) {
                                        console.log("block ajouté " + parsedBlock.blockInfo.blockNumber)
                                    })
                                }
                                if (index == result.length - 1) {
                                    console.log("Boucle terminée on execute cette fonction")
                                    blocks.put("index", parsedBlock.blockInfo.blockNumber, function (err, value) {
                                        console.log("index mis à jour " + parsedBlock.blockInfo.blockNumber)
                                    })
                                }
                            }


                        });
                    })
                }
                // LOGIQUE AJOUT BLOCKS



            }
        });

    });


}
module.exports.getBlocks = getBlocks


function killServer() {
    let pid
    let client = new WebSocketClient();
    client.connect('ws://localhost:8080/', 'echo-protocol');
    client.on('connect', function (connection) {
        // Récupération de la connection local pour réutilisation pour ne pas avoir à se reconnecter

        let prepareData = {
            type: "killServer"
        }
        connection.sendUTF(JSON.stringify(prepareData))
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log(JSON.parse(message.utf8Data))
            }
        });
    });
}

module.exports.killServer = killServer

// module.exports = {
//     super(){
//         console.log('boifdig')
//     }
// }

// récupérer une liste de serveur et se connecter à un noeud


let localconnect

// signWalletAndConfirmCreation()
module.exports.sendTransaction = function (value, toPubK) {
    let client = new WebSocketClient();
    client.connect('ws://localhost:8080/', 'echo-protocol');
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

module.exports.test = function () {
    console.log("TEST********")
    console.log(localconnect)
};
