// ************************ //
// Warning: By touching this code, you can be banned from the network.
// The integrity of the network depends on a uniform code and similar functions.
// Attempting to change the code can get you banned from the network.
// ************************ //

var tools = require('./client.js')
var ip = require('ip');
const level = require('level')
const wallets = level('wallets')
const blocks = level('blocks')
const infos = level('infos')
const gazfee = 0.025

let leader = false


var WebSocketServer = require('websocket').server;
var http = require('http');
const bs58 = require('bs58')
let elliptic = require('elliptic');
let sha3 = require('js-sha3');
let ec = new elliptic.ec('secp256k1');

let connectedPeers = []
let pool = []
let stackers = []

// CLIENT PART TO CONNECT TO ANOTHER NODES.
var WebSocketClient = require('websocket').client;
let client = new WebSocketClient();
client.connect('ws://192.168.1.13:8081/', 'echo-protocol');
client.on('connect', function (connection) {
    // connection.on('message', function (message) {
    //     if (message.type === 'utf8') {
    //         console.log(message.utf8Data);
    //     }
    // });
    sendBecomeStacker(connection)
});

function sendBecomeStacker(connection){
    console.log('becommme')
    let message = JSON.stringify({
        type: 'becomeStacker',
        date: Date.now()
    });

    let prepareData = {
        type: "becomeStacker",
        message: message,
        signature: tools.signMessage(message)
    }

        connection.sendUTF(JSON.stringify(prepareData))
        // connection.close()
        // walletest à supprimer delete deleted
        wallets.put('oUn5x1mrX9obBdj8oXspS1TAeKLMY5YMFPUtr8oPrXTk', JSON.stringify({
            value: 1000,
            creationDate: Date.now(),
            lastInfoModification: Date.now(),
            lastTransaction: {
                block: null,
                hash: null
            }
        }), function (err, value) {
            if (err) return console.log('Ooops!', err) // some kind of I/O error
        })
        // fin à a supprimer
    
}

// END CLIENT PART TO CONNECT TO ANOTHER NODES


var server = http.createServer(function (request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});


wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
// setInterval(() => {
//     AmILeader()
//     switch (leader) {
//         case true:
//             break;

//         default:
//             break;
//     }
// }, 1000);



function AmILeader() {
    //  On vérifie si je suis validateur
    stackers.includes(ip.address()) ? leader = true : leader = false
    //     let obj = arr.find(o => o.name === 'string 1');
    // console.log(obj);
}



wsServer.on('request', function (request) {
    console.log(request.origin)
    // Accept the connection of the nodes
    // console.log(connectedPeers.indexOf(request.remoteAddress) > -1) // activer pour la prod
    if (!originIsAllowed(request.origin) || connectedPeers.includes(request.remoteAddress.split(":").pop()) == true) {

        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.remoteAddress + ' rejected.');
        return;
    }
    console.log(connectedPeers.includes(request.remoteAddress.split(":").pop()))

    var connection = request.accept('echo-protocol', request.origin);

    let remoteIP = request.remoteAddress.split(":").pop()

    function validateBlock() {

    }
    if(connectedPeers.findIndex((peer) => peer.ip === remoteIP) < 0){ // Ne pas ajouter plusieurs fois la même IP dans les peers connected, garde fou
        connectedPeers.push({ip:request.remoteAddress.split(":").pop(), stacking: false}) // Si l'IP existe déjà alors on ajoute pas, sinon on ajoute
    }

    // console.log(connectedPeers.includes(request.remoteAddress.split(":").pop()))
    console.log(connectedPeers)
    console.log((new Date()) + ' Connection accepted.');

    // Receiving messages from nodes (peers)
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            try {
                // console.log(message)
                console.log("top")
                // Réception du message
                // Décodage du message utf8 en json lisible
                var result = JSON.parse(message.utf8Data);
                console.log(result)


                switch (result.type) {
                    case "createWallet":
                        console.log('Ok on va créer un wallet');
                        verifyWallet(result)
                        break;
                    case "sendTransaction":
                        console.log("sendTransaction");
                        sendTransaction(result)
                        break;
                    case "becomeStacker":
                        console.log("becomeStacker");
                        becomeStacker(connection.remoteAddress.split(":").pop(), result)
                        break;
                    default:
                        console.log(`Sorry, ${result.type} doesn't exist`);
                }
                // console.log(JSON.parse(result.walletToVerify))
                // console.log(JSON.parse(result.signature))

            } catch (err) {
                connection.sendUTF('GIGANETWORK: connection ok but no case type found');
                return null
            }
        }
        else if (message.type === 'binary') {
            console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
            connection.sendBytes(message.binaryData);
        }
    });
    connection.on('close', function (reasonCode, description) {
        // We delete the last connection from our List of peers
        connectedPeers = connectedPeers.filter(function (o) {
            setTimeout(() => {
                console.log(connectedPeers)
            }, 1000);
            return o.ip !== connection.remoteAddress.split(":").pop()

        });

        console.log((new Date()) + ' Peer ' + connection.remoteAddress.split(":").pop() + ' disconnected.');
    });



    function becomeStacker(ip, result){
        console.log(verifySignature(result))
        console.log(JSON.parse(result.message).date)
        console.log(Date.now() - JSON.parse(result.message).date)
        if(Date.now() - JSON.parse(result.message).date < 60000){
            w.get(verifySignature(result), function (err, value) {
                if(JSON.parse(value).value >= stackingmin){
                    let indexPeer
                    indexPeer = connectedPeers.findIndex((peer) => peer.ip === ip)
                    if(indexPeer >= 0 && connectedPeers[indexPeer].stacking == false){
                        connectedPeers[indexPeer].stacking = true
                        connectedPeers[indexPeer].signature = result
                        console.log(connectedPeers)
                    }
                }
            })
        }
    }



    function verifySignature(result){
        let msgHash = sha3.keccak256(result.message)
        console.log("msghash : " + msgHash)

        let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex")
            .getPrivate().toString(10);

        let pubKeyRecovered = ec.recoverPubKey(
            hexToDecimal(msgHash), JSON.parse(result.signature),
            JSON.parse(result.signature).recoveryParam, "hex");
        console.log("Recovered pubKey:",
            pubKeyRecovered.encodeCompressed("hex"));

        console.log("pubkeyy")


        const bytes = Buffer.from(pubKeyRecovered.encodeCompressed("hex"), 'hex')
        const addressRecovered = bs58.encode(bytes)
        return addressRecovered;
    }

    function sendTransaction(result) {
        console.log(JSON.parse(result.message).amountToSend)
        const addressRecovered = verifySignature(result)
        console.log(addressRecovered)


        try {
            wallets.put(addressRecovered, JSON.stringify({
                value: 1000,
                creationDate: Date.now(),
                lastInfoModification: Date.now(),
                lastTransaction: {
                    block: null,
                    hash: null
                }
            }), function (err, value) {
                if (err) return console.log('Ooops!', err) // some kind of I/O error
    
    
            })
            wallets.put('test', JSON.stringify({
                value: 1000,
                creationDate: Date.now(),
                lastInfoModification: Date.now(),
                lastTransaction: {
                    block: null,
                    hash: null
                }
            }), function (err, value) {
                if (err) return console.log('Ooops!', err) // some kind of I/O error
    
    
            })
            wallets.get(addressRecovered, function (err, value) {
                const valueInWallet = JSON.parse(value).value
                const amountToSend = JSON.parse(result.message).amountToSend
                console.log(valueInWallet + (valueInWallet * (gazfee/100)))
                if (value != undefined){
                    if((amountToSend + (amountToSend * (gazfee/100))) <= valueInWallet){
                        wallets.get(JSON.parse(result.message).toPubK, function(err, value){
                            if(value != undefined){
                            pool.push(result) // on push le message dans la pool de transaction
                            connection.sendUTF('Gas fees will be : ' + (amountToSend * (gazfee/100)))
                            console.log(pool) 
                            connection.sendUTF('GIGANETWORK: Wallet found and you have sufficient $GIGA spendable, Transaction added to the validation pool.')
                            } else {
                                connection.sendUTF("GIGANETWORK: the recipient's key does not exist into this node")
                            }
                        })

                    } else {
                        connection.sendUTF('GIGANETWORK: Not enough $GIGA')
                        connection.sendUTF("GIGANETWORK: You may not have enough to pay for gas")
                        connection.sendUTF('Gas fees will be : ' + (amountToSend * (gazfee/100)))
                        connection.sendUTF('To send ' + amountToSend + ", you need " + (amountToSend + (amountToSend * (gazfee/100))))
                    }
                }


            })
        } catch (error) {
            console.log(error)
        }

        // console.log("Signature valid?", validSig)
    }


    function verifyWallet(result) {
        // LET'SCONTROL WALLET AUTHENTICITY
        let msgHash = sha3.keccak256(result.walletToVerify)

        let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex")
            .getPrivate().toString(10);
        let pubKeyRecovered = ec.recoverPubKey(
            hexToDecimal(msgHash), JSON.parse(result.signature),
            JSON.parse(result.signature).recoveryParam, "hex");
        console.log("Recovered pubKey:",
            pubKeyRecovered.encodeCompressed("hex"));
        let validSig = ec.verify(
            msgHash, JSON.parse(result.signature), pubKeyRecovered);
        console.log("pubkeyy")

        console.log("Signature valid?", validSig);
        if (validSig == true) {
            connection.sendUTF('GIGANETWORK: signature ok we try to add your wallet')
            try {
                const bytes = Buffer.from(pubKeyRecovered.encodeCompressed("hex"), 'hex')
                const address = bs58.encode(bytes)
                console.log(address)

                wallets.get(address, function (err, value) {
                    console.log(value)
                    console.log("wget")

                    if (value == undefined) {
                        connection.sendUTF('Wallet added')
                        wallets.put(address, JSON.stringify({
                            value: 0,
                            creationDate: Date.now(),
                            lastInfoModification: null,
                            lastTransaction: {
                                block: null,
                                hash: null
                            }
                        }), function (err, value) {
                            if (err) return console.log('Ooops!', err) // some kind of I/O error


                        })

                    } else {
                        connection.sendUTF('GIGANETWORK: Wallet already exist')
                    }

                })

            } catch (err) {

            }
        } else {
            connection.sendUTF('Invalid wallet')
        }
    }

    function insertDecimal(num) {
        return (num / 100).toFixed(8);
     }

});