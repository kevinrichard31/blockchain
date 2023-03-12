// ************************ //
// Warning: By touching this code, you can be banned from the network.
// The integrity of the network depends on a uniform code and similar functions.
// Attempting to change the code can get you banned from the network.
// ************************ //

// let tools = require('./client.js')
let process = require('process');
var http = require('http');
let ip
http.get({ 'host': 'checkip.amazonaws.com', 'port': 80, 'path': '/' }, function (resp) {
    resp.on('data', function (ipo) {
        ip = ipo.toString().replace(/(\r\n|\n|\r)/gm, "");
    });
});


const level = require('level')
const wallets = level('wallets')
const blocks = level('blocks')
const infos = level('infos')

const gazfee = 0.25
const stackingmin = 1000
let leader = false



var WebSocketServer = require('websocket').server;
var http = require('http');
const bs58 = require('bs58')
let elliptic = require('elliptic');
let sha3 = require('js-sha3');
const { Console } = require('console');
let ec = new elliptic.ec('secp256k1');

let connectedPeers = []
let pool = []
let stackers = []
let biggestHolder

// CLIENT PART TO CONNECT TO ANOTHER NODES.
// var WebSocketClient = require('websocket').client;
// let client = new WebSocketClient();
// FONCTION A PASSER EN CLIENT
// client.connect('ws://192.168.1.13:8080/', 'echo-protocol');
// client.on('connect', function (connection) {
//     // connection.on('message', function (message) {
//     //     if (message.type === 'utf8') {
//     //         console.log(message.utf8Data);
//     //     }
//     // });
//     sendBecomeStacker(connection)
//         // connection.sendUTF(JSON.stringify({type:'supertest'}))
// });


// w6pmv3zMkXPGdwPM1ANaEPDoVVUEomsSSrECDPitPf4M
// wallets.put('w6pmv3zMkXPGdwPM1ANaEPDoVVUEomsSSrECDPitPf4M', JSON.stringify({
//     value: 1000,
//     creationDate: Date.now(),
//     lastInfoModification: Date.now(),
//     lastTransaction: {
//         block: null,
//         hash: null
//     }
// }), function (err, value) {
//     if (err) return console.log('Ooops!', err) // some kind of I/O error
// })

// setTimeout(() => {
//     wallets.get('w6pmv3zMkXPGdwPM1ANaEPDoVVUEomsSSrECDPitPf4M', function (err, value) {
//         if (err) return console.log('Ooops!', err) // some kind of I/O error

//         let x = JSON.parse(value)
//         console.log("🌱 ~ file: server.js:77 ~ x", x)
        
        
//     });
// }, 5000);

// setTimeout(() => {
//     blocks.get(0, function (err, value) {
//         if (err) return console.log('Ooops!', err) // some kind of I/O error

//         let x = JSON.parse(value)
//         console.log("🌱 ~ file: server.js:77 ~ x", x)
        
        
//     });
// }, 5000);



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
setInterval(() => {
    AmILeader()
    // console.log(connectedPeers)
    switch (leader) {
        case true:
            console.log("[[[You are Leader !]]] You are connected as stacker ! ****Congratulations*****")
            break;
        case false:
            pool = [];
            break;
        default:
            break;
    }
}, 5000);


// ENVOYER SA TRANSACTION A UN AUTRE NOEUD
// LEADER SE CONNECTE EN TANT QUE LEADER FALSE, CONFLIAT AVEC LE BECOME STACKER

// FONCTIONS CLIENTS

// async function sdf() {
// try {
//     let index = await blocks.get(1)
//     console.log(JSON.parse(index))
// } catch (error) {

// }
// }
// sdf()

async function AmILeader() {
    //  On vérifie si je suis validateur

    
    let obj = connectedPeers.find(o => o.ip == ip)
    // console.log(connectedPeers)

    try {
        connectedPeers.forEach(element => {
            // console.log(element.wallet + " " + element.ip + " " + element.stacking)
        });
        let walletValueChecker = []
        for (const peer of connectedPeers) {
            let peerSignature = verifySignature(peer.signature)
            let peerWallet = await wallets.get(peerSignature);
            walletValueChecker.push(
                {
                    ip: peer.ip,
                    value: JSON.parse(peerWallet).value
                }
            )
        }
        biggestHolder = walletValueChecker.reduce(
            (prev, current) => {
                // Changed the > to a <
                if (current.value == undefined || current.stacking != true) {
                    return prev
                } else {
                    return prev.value > current.value ? prev : current
                }
            }
        );
        console.log("🌱 ~ file: server.js:177 ~ AmILeader ~ biggestHolder", biggestHolder)

        if (biggestHolder.ip == ip) {
            leader = true
            console.log("🌱 ~ file: server.js:182 ~ AmILeader ~ leader", leader)
        } else {
            leader = false
        }
    } catch (error) {

    }
    // console.log(connectedPeers)
    // stackers.includes(ip.address()) ? leader = true : leader = false
    //     let obj = arr.find(o => o.name === 'string 1');
    // console.log(obj);
}

let p = [{
    type: 'sendTransaction',
    message: '{"amountToSend":1,"toPubK":"oUn5x1mrX9obBdj8oXspS1TAeKLMY5YMFPUtr8oPrXTk","type":"sendTransaction","date":1646808628249}',
    signature: '{"r":"6343bf514dbc58fe7e771b9dde5d242c3a81e74ff917e663b0d94319adf71b2e","s":"a0aa8e71c9442af97d0300925e2e7fb4ecc882b926a4ba03d6122cae8a1272d7","recoveryParam":0}',
    hash: '2ysdfga6566e76240543f8feb06fd457777be39549c4016436afda65d2330e'
}

]

// blocks.get(1, function (err, indexNumber) {
//     let result = JSON.parse(indexNumber)
//     console.log(result.blockInfo.hash)
//     blocks.get(2, function (err, resulttwo) {
//         let resultwoparsed = JSON.parse(resulttwo)
//         console.log(resultwoparsed.blockInfo.hash)
//         let hashblock = sha3.keccak256(resultwoparsed.blocks + result)
//         console.log(hashblock)
//     })
// })

function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}
pool = [
    // {
    //     type: 'sendTransaction',
    //     message: '{"amountToSend":10,"toPubK":"oUn5x1mrX9obBdj8oXspS1TAeKLMY5YMFPUtr8oPrXTk","type":"sendTransaction","date":1662057055930}',
    //     signature: '{"r":"3b80b7d5b3b0e17933078379b231f9fa61bafb7819eab317fd8b489dac58b2cd","s":"8c05fd9f57ebdcb0e219734c42ab7be4ecb55d07e508f872846c53e205a63771","recoveryParam":1}',
    //     hash: '1ba188cfb1af00fb1ed909ab97e23d7279518c98b090e340bc61eb39e8474f6d'
    // },
    // {
    //     type: 'sendTransaction',
    //     message: '{"amountToSend":10,"toPubK":"oUn5x1mrX9obBdj8oXspS1TAeKLMY5YMFPUtr8oPrXTk","type":"sendTransaction","date":1662057055930}',
    //     signature: '{"r":"3b80b7d5b3b0e17933078379b231f9fa61bafb7819eab317fd8b489dac58b2cd","s":"8c05fd9f57ebdcb0e219734c42ab7be4ecb55d07e508f872846c53e205a63771","recoveryParam":1}',
    //     hash: '1ba188cfb1af00fb1ed909ab97e23d7279518c98b090e340bc61eb39e8474f6d'
    // }

]
// Fonction validé uniquement par le stacker master




async function validateBlock() {
    // Initialisation du block qui sera intégré en blockchain
    let blockPush = { blocks: [] }
    // wallets.get("w6pmv3zMkXPGdwPM1ANaEPDoVVUEomsSSrECDPitPf4M", function (err, value) {
    //     console.log(JSON.parse(value))

    // })
    // blocks.get(9, function (err, value) {
    //     console.log(JSON.parse(value))

    // })
    // blocks.put(1, JSON.stringify(pool), function (err, value) {
    //     blocks.put("index", 1, function (err, value) {
    //         if (err) return console.log('Ooops!', err) // some kind of I/O error
    //     })
    //     if (err) return console.log('Ooops!', err) // some kind of I/O error
    // })
    // verifySignature(pool[0])
    // let qsdfqsdf = verifySignature(pool[0])
    // console.log(qsdfqsdf)



    console.log("la pool")
    // console.log(pool)
    //ENGLISH
    // This function allows to get the transactions from the pool and to record them in new blocks
    // It's the block generator
    // Attention, the transactions are checked beforehand with the transaction pool
    console.log(pool.length + " in transactions pool") // we verify the size pool
    // console.log(JSON.stringify(pool[0]))
    let blocbuilder = []
    pool.sort(GetSortOrder("hash")) // on tri la pool par ordre de hash
    for (let index = 0; index < 10; index++) { // COPY x FIRSTS
        if (pool[index] != undefined) {
            blocbuilder.push(pool[index])
        }
    }
    // console.log(blocbuilder)
    pool.splice(0, 10); // on supprime les 10 premiers de la pool


    // Parti vérification des wallets
    // vérifier que l'adresse existe
    // vérifier que le montant est disponible
    // mettre à jour le wallet
    for (let element of blocbuilder) {

        try {
            let addressRecovered = verifySignature(element)
            console.log('addresse récupérée **********')
            console.log(addressRecovered)
            console.log('array')
            // console.log(arr)
            let value = await wallets.get(addressRecovered)
            let wallet = JSON.parse(value)
            let valueInWallet = JSON.parse(value).value
            let amountToSend = JSON.parse(element.message).amountToSend
            let amountToSendPlusGazFee = (amountToSend + (amountToSend * (gazfee / 100)))
            // console.log(valueInWallet + (valueInWallet * (gazfee / 100)))
            if (value != undefined) { // vérifie qu'il y a bien une adresse
                if (amountToSendPlusGazFee <= valueInWallet) { // vérifie valeur dans wallet + gazfee suffisant
                    // Récupération informations du wallet receveur
                    console.log("element ********")
                    let toPubk = JSON.parse(element.message).toPubK
                    console.log(toPubk)
                    let toPubkWallet = await wallets.get(toPubk)
                    toPubkWallet = JSON.parse(toPubkWallet)
                    console.log("toPubkWallet ********")
                    console.log(toPubkWallet)
                    toPubkWallet.value = toPubkWallet.value + amountToSend
                    await wallets.put(toPubk, JSON.stringify(toPubkWallet))
                    // console.log("suffisant")
                    // console.log(amountToSendPlusGazFee)
                    // on change la valeur en base
                    // console.log("compte")
                    // récupérer la nouvelle valeur
                    wallet.value = JSON.parse((JSON.parse(value).value - amountToSendPlusGazFee).toFixed(8))
                    // console.log("wallet value")
                    // console.log(wallet)
                    // envoyer en base
                    await wallets.put(addressRecovered, JSON.stringify(wallet))

                    // AJOUT DES TRANSACTIONS DANS LE BLOCK
                    blockPush.blocks.push(element)


                    wallets.get(addressRecovered, function (err, value) {
                        console.log("nouvelle valeur envoyeur")
                        console.log(JSON.parse(value).value)
                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                    })
                    wallets.get(toPubk, function (err, value) {
                        console.log("nouvelle valeur receveur")
                        console.log(JSON.parse(value).value)
                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                    })
                } else {

                }
            }
        } catch (error) {

        }
    }



    blocks.get('index', function (err, indexNumber) { // on vérifie le nouveau index

        // On récupère le numéro d'indexation
        console.log('indexNumber*************')
        console.log(indexNumber)
        let previousBlock
        let previousBlockHash
        // console.log("***********ACTUAL INDEXERRERRR***********")
        // console.log(JSON.parse(value))



        if (indexNumber != undefined) {
            console.log("INDEXNUMBER a deja une valeur !")
            // console.log(indexNumber)

            blocks.get(indexNumber, function (err, result) {
                previousBlock = JSON.parse(result)
                previousBlockHash = previousBlock.blockInfo.hash

                if (blockPush.blocks.length >= 1 && indexNumber != undefined) { // vérifier si il y a des transactions à ajouter
                    let newindex = JSON.parse(indexNumber) + 1
                    console.log(newindex)
                    console.log('blockPush BLOCKINFO **********')
                    // AJOUT DES INFORMATIONS DU BLOCK
                    //  = blocks.get(newindex-1)
                    // previousBlock = JSON.parse(previousBlock)
                    blockPush.blockInfo =
                    {
                        blockNumber: newindex,
                        creationDate: new Date(),
                        previouHash: previousBlockHash,
                        hash: sha3.keccak256(blockPush.blocks + previousBlockHash)
                    }

                    // console.log(blockPush)
                    blocks.put(newindex, JSON.stringify(blockPush), function (err, value) { // on met à jour le nouveau block
                        blocks.put("index", newindex, function (err, value) { // on met à jour le nouveau index
                            blocks.get('index', function (err, value) { // on vérifie le nouveau index
                                console.log(JSON.parse(value) + " valeur du nouveau index") // on affiche le nouveau index
                                blocks.get(JSON.parse(value), function (err, value) { // on récupère le dernier block
                                    console.log(JSON.parse(value)) // on affiche le dernier block
                                })
                            })
                            if (err) return console.log('Ooops!', err) // some kind of I/O error
                        })
                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                    })

                }
            })
            // console.log(previousBlock)

        } else if (indexNumber == undefined) {
            if (blockPush.blocks.length >= 1 && indexNumber == undefined) {
                blockPush.blockInfo =
                {
                    blockNumber: 0,
                    creationDate: new Date(),
                    hash: sha3.keccak256(blockPush.blocks)
                }
                blocks.put(0, JSON.stringify(blockPush), function (err, value) {
                    blocks.put("index", 0, function (err, value) {
                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                        console.log("PREMIER BLOCK**************************")
                        blocks.get(0, function (err, value) { // on récupère le dernier block
                            console.log(JSON.parse(value)) // on affiche le dernier block
                        })
                    })
                    if (err) return console.log('Ooops!', err) // some kind of I/O error
                })
            }
        }

    })











}

setInterval(() => {
    if (leader == true) {
        validateBlock()
    }
}, 5000);


function verifySignature(result) {
console.log("🌱 ~ file: server.js:458 ~ verifySignature ~ result:", result)

    let msgHash = sha3.keccak256(result.message)
    // console.log("msghash : " + msgHash)

    let hexToDecimal = (x) => ec.keyFromPrivate(x, "hex")
        .getPrivate().toString(10);

    let pubKeyRecovered = ec.recoverPubKey(
        hexToDecimal(msgHash), JSON.parse(result.signature),
        JSON.parse(result.signature).recoveryParam, "hex");
    // console.log("Recovered pubKey:",
    //     pubKeyRecovered.encodeCompressed("hex"));

    // console.log("pubkeyy")


    const bytes = Buffer.from(pubKeyRecovered.encodeCompressed("hex"), 'hex')
    const addressRecovered = bs58.encode(bytes)
    return addressRecovered;
}



let connectedList = []
wsServer.on('request', function (request) {
    let remoteIP = request.remoteAddress.split(":").pop()
    console.log(remoteIP)
    // Accept the connection of the nodes
    // console.log(connectedPeers.indexOf(request.remoteAddress) > -1) // activer pour la prod
    // if (!originIsAllowed(request.origin) || connectedPeers.includes(request.remoteAddress.split(":").pop()) == true || obj != undefined) {

    //     // Make sure we only accept requests from an allowed origin
    //     if (remoteIP != "127.0.0.1") {
    //         request.reject();
    //         console.log((new Date()) + ' Connection from origin ' + request.remoteAddress + ' rejected.');
    //         return;
    //     }
    // }

    let connection = request.accept('echo-protocol', request.origin);
    // console.log(connection)
    connectedList.push({ ip: remoteIP, connection: connection, id: gID() })
    if (connectedList.filter(peer => peer.ip == remoteIP).length > 100) {
        connectedList.filter(peer => peer.ip == remoteIP).forEach(element => {
            element.connection.sendUTF(JSON.stringify('You have been kicked, server are limited to 3 connections per ip'));
            connectedList = connectedList.filter(peer => peer.ip != remoteIP)
            element.connection.close()
        });
    }
    if (request.remoteAddress.split(":").pop().includes('127.0') || request.remoteAddress.split(":").pop().includes('192.168')) {
        remoteIP = ip
    }
    if (connectedPeers.filter(peer => peer.ip == remoteIP).length < 1) { // Limit 3 > Ne pas ajouter plusieurs fois la même IP dans les peers connected, garde fou

        if (remoteIP == ip) {
            connectedPeers.push({ ip: ip, stacking: false, connection: connection, id: gID() }) // Si l'IP existe déjà alors on ajoute pas, sinon on ajoute
        } else {
            connectedPeers.push({ ip: remoteIP, stacking: false, connection: connection, id: gID() }) // Si l'IP existe déjà alors on ajoute pas, sinon on ajoute
        }
    } else {
        console.log('******** TOO MANY SAME IP ********')
        if (remoteIP != ip) {
            connection.close()
        }
    }
    // console.log(connectedPeers)
    // Permet d'envoyer des messages à tout le réseau
    // connectedPeers.forEach(element => {
    //     element.connection.sendUTF('superman')
    // });
    // console.log(connectedPeers.includes(request.remoteAddress.split(":").pop()))

    console.log((new Date()) + ' Connection accepted.');

    // Receiving messages from nodes (peers)
    connection.on('message', function (message) {
        console.log('AVREMESS')
        console.log(message)
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
                    // case "getBalance":
                    //     console.log('on vérifie la balance');
                    //     getBalance(result)
                    //     break;
                    case "sendTransaction":
                        console.log("sendTransaction");
                        console.log(result)
                        console.log('cest le resultat')
                        sendTransaction(result)
                        break;
                    case "becomeStacker":
                        console.log("becomeStacker");
                        console.log(connection.remoteAddress.split(":").pop() == "127.0.0.1")
                        if (connection.remoteAddress.split(":").pop() == "127.0.0.1") {
                            becomeStacker(ip, result) // add self ip
                        } else {
                            becomeStacker(connection.remoteAddress.split(":").pop(), result)
                        }


                        break;
                    case "getIndex":
                        console.log("becomeStacker");
                        async function getIndex() {
                            let index = await blocks.get('index')

                            
                            connection.sendUTF(index)
                        }
                        getIndex()
                        break;
                    case "getBlocks":
                        console.log("getBlocks");
                        console.log(result.getBlocks)
                        if (result.getBlocks.length > 100) {
                            connection.sendUTF(JSON.stringify('Too many blocks asked'))
                        } else {
                            blocks.getMany(result.getBlocks, function (err, value) {
                                console.log('ON RETOURNE')
                                console.log(value)
                                connection.sendUTF(JSON.stringify(value))
                            })
                            // blocks.get(0, function (err, value) {
                            //     console.log('ON RETOURNE')
                            //     console.log(value)
                            //     connection.sendUTF(JSON.stringify(value))
                            // })
                        }


                        break;
                    case "getPeerList":
                        console.log("getPeerList");
                        let prepareData = connectedPeers
                        // On supprime la connection, à cause un crash à cause d'une référence circulaire.
                        prepareData.forEach(element => {
                            delete element['connection']
                        });
                        console.log('prepareData')

                        connection.sendUTF(JSON.stringify(prepareData))
                        break;
                    case "getBiggestHolder":
                        console.log("GET BIGGEST HOLDER");
                        // console.log(biggestHolder)
                        // On supprime la connection, à cause un crash à cause d'une référence circulaire.
                        connection.sendUTF(JSON.stringify(biggestHolder))
                        break;

                    case "genesisBlock":

                        console.log("🌱 ~ GENESIS BLOCK LOCAL BUILD", result)
                        blocks.put(0, JSON.stringify(result), function (err, value) {
                            if (err) return console.log('Ooops!', err) // some kind of I/O error

                            blocks.get(0, function (err, value) {
                                console.log("🌱 ~ file: server.js:625 ~ value:", value)
                                if (err) return console.log('Ooops!', err) // some kind of I/O error

                            })
                            blocks.put("index", 0, function (err, value) {
                                if (err) return console.log('Ooops!', err) // some kind of I/O error
                            })
                        })
                        break;

                    case "killServer":
                        console.log(process.pid)
                        connection.sendUTF(process.pid)
                        // process.kill(process.pid)
                        break;
                    default:
                        console.log(`Sorry, ${result.type} doesn't exist`);
                }
                // console.log(JSON.parse(result.walletToVerify))
                // console.log(JSON.parse(result.signature))

            } catch (err) {
                console.log(err)
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
        // We delete the connection from our List of peers
        connectedPeers = connectedPeers.filter(function (o) {
            // setTimeout(() => {
            //     console.log(connectedPeers)
            // }, 1000);
            // supprimer la connection sauf si l'ip est local
            console.log(o)
            if (o.ip == ip) {
                return o
            } else {
                return o.ip !== connection.remoteAddress.split(":").pop()
            }

        });
        console.log((new Date()) + ' Peer ' + connection.remoteAddress.split(":").pop() + ' disconnected.');
    });

    function becomeStacker(ip, result) {
        console.log("*****BECOMESTACKER******")
        let indexPeer
        indexPeer = connectedPeers.findIndex((peer) => peer.ip === ip)
        let wallet = verifySignature(result)
        console.log(wallet)
        let finder = connectedPeers.find(o => o.wallet === wallet)
        console.log("*****FINDER******")
        if (typeof finder == 'undefined') {
            console.log("OK PAS DE DOUBLON")
            console.log(JSON.parse(result.message).date)
            console.log(Date.now() - JSON.parse(result.message).date)
            if (Date.now() - JSON.parse(result.message).date < 60000) {
                wallets.get(verifySignature(result), function (err, value) {
                    console.log(value + " fdfd")
                    if (JSON.parse(value).value >= stackingmin) {

                        console.log("*****indexpeer******")
                        console.log(indexPeer)
                        if (indexPeer >= 0 && connectedPeers[indexPeer].stacking == false) {
                            connectedPeers[indexPeer].stacking = true
                            connectedPeers[indexPeer].signature = result
                            connectedPeers[indexPeer].wallet = wallet
                            // console.log(connectedPeers)
                            console.log("ip stacked")
                        }
                    }
                })
            }
        } else {
            connectedPeers[indexPeer].connection.close()
            console.log('DOUBLON !')
        }


    }





    function sendTransaction(result) {


        console.log(JSON.parse(result.message).amountToSend)
        const addressRecovered = verifySignature(result)
        console.log(addressRecovered)

        try {
            wallets.get(addressRecovered, function (err, value) {
                const valueInWallet = JSON.parse(value).value
                const amountToSend = JSON.parse(result.message).amountToSend
                console.log(valueInWallet + (valueInWallet * (gazfee / 100)))
                if (value != undefined) { // vérifie qu'il y a bien une adresse
                    if ((amountToSend + (amountToSend * (gazfee / 100))) <= valueInWallet) { // vérifie valeur dans wallet + gazfee suffisant
                        wallets.get(JSON.parse(result.message).toPubK, function (err, value) {
                            if (value != undefined) {

                                console.log("transaction before push to pool : " + JSON.stringify(result))
                                result.hash = sha3.keccak256(JSON.stringify(result)) // on stringify la transaction et on hash la transaction stringifié
                                console.log("transaction hash: " + result.hash)
                                let obj = pool.find(o => o.hash === result.hash) // on vérifie qu'il y est pas de doublon dans la pool de transaction


                                if (obj == undefined) {
                                    pool.push(result) // on push le message dans la pool de transaction
                                    connectedPeers.forEach(element => {
                                        console.log(element.ip)
                                        // console.log(result)

                                        if (element.stacking == true && element.ip != ip) {
                                            element.connection.sendUTF(result)
                                        }
                                    });
                                    connection.sendUTF('Gas fees will be : ' + (amountToSend * (gazfee / 100)))
                                    connection.sendUTF('GIGANETWORK: Wallet found and you have sufficient $GIGA spendable, Transaction added to the validation pool. Verify on blockexplorer that transaction has been validated')
                                } else {
                                    connection.sendUTF('GIGANETWORK: transaction already exist')
                                }
                                console.log(pool)
                            } else {
                                connection.sendUTF("GIGANETWORK: the recipient's key does not exist into this node")
                            }
                        })

                    } else {
                        connection.sendUTF('GIGANETWORK: Not enough $GIGA')
                        connection.sendUTF("GIGANETWORK: You may not have enough to pay for gas")
                        connection.sendUTF('Gas fees will be : ' + (amountToSend * (gazfee / 100)))
                        connection.sendUTF('To send ' + amountToSend + ", you need " + (amountToSend + (amountToSend * (gazfee / 100))))
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

function gID() {
    return Math.random().toString(16).slice(2)
}



// synchronise les wallets par rapport aux blocs enregistrés
async function syncWallets() {
    console.log("🌱 ~ file: server.js:818 ~ syncWallets ~ syncWallets", syncWallets)
    try {
        blocks.get('index', function (err, indexGet) {
            console.log("🌱 ~ file: server.js:845 ~ indexGet:", indexGet)
            if (indexGet == undefined) {
            console.log("🌱 ~ file: server.js:850 ~ indexGet:", indexGet)

                
            } else if(indexGet == 0) { // GENESIS BLOCK FIRST BLOCK SYNC-ING
                blocks.get(0, function (err, value) {
                    if (err) return console.log('Ooops!', err) // some kind of I/O error

                    let valueParsed = JSON.parse(value)
                    console.log("🌱 ~ file: server.js:853 ~ valueParsed:", valueParsed)

                    let walletIdGenesis = verifySignature(valueParsed)
                    console.log("🌱 ~ file: server.js:862 ~ walletIdGenesis:", walletIdGenesis)
                    let messageParsed = JSON.parse(valueParsed.message)
                    console.log("🌱 ~ file: server.js:864 ~ messageParsed:", messageParsed)
                    wallets.put(walletIdGenesis, JSON.stringify({
                        value: messageParsed.maxSupply,
                        lastTransaction: {
                            block:valueParsed.blockInfo.blockNumber,
                            hash: valueParsed.blockInfo.hash
                        }
                    }), function (err, value) {
                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                        wallets.get(walletIdGenesis, function (err, value) {
                            if (err) return console.log('Ooops!', err) // some kind of I/O error
                            console.log("🌱 ~ file: server.js:873 ~ value", JSON.parse(value))
                        })
                    })
                })
                
            } else {
                indexGet = JSON.parse(indexGet)
                for (let index = 1; index <= indexGet; index++) { // BOUCLE POUR CHAQUE BLOCK
                    console.log("🌱 ~ file: server.js:826 ~ index", index)
                    
                    setTimeout(() => {
                        
                        blocks.get(index, function (err, blockdata) {
                            if (blockdata == undefined) {
        
                            } else {
                                let block = JSON.parse(blockdata)
                                console.log("🌱 ~ file: server.js:846 ~ block", block)

                                for (let indexTx = 0; indexTx < block.blocks.length; indexTx++) {
                                        setTimeout(() => {
                                            let message = JSON.parse(block.blocks[indexTx].message)
                                            let walletIdSender = verifySignature(block.blocks[indexTx])
                                            let walletIdReceiver = message.toPubK
            
                                            
                                            wallets.get(walletIdSender, function (err, value) {
                                                if (value == undefined) {
                                                    wallets.put(walletIdSender, JSON.stringify({
                                                        value: 0 - message.amountToSend,
                                                        lastTransaction: {
                                                            block: block.blockInfo.blockNumber,
                                                            hash: block.blockInfo.hash
                                                        }
                                                    }), function (err, value) {
                                                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                                                    })
                                                } else {
                                                    let walletSender = JSON.parse(value)
                                                    wallets.put(walletIdSender, JSON.stringify({
                                                        value: walletSender.value - message.amountToSend,
                                                        lastTransaction: {
                                                            block: block.blockInfo.blockNumber,
                                                            hash: block.blockInfo.hash
                                                        }
                                                    }), function (err, value) {
                                                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                                                    })
                                                }
                                            });
                                    
                                            wallets.get(walletIdReceiver, function (err, value) {
                                                if (value == undefined) {
                                                    wallets.put(walletIdReceiver, JSON.stringify({
                                                        value: 0 - message.amountToSend,
                                                        lastTransaction: {
                                                            block: block.blockInfo.blockNumber,
                                                            hash: block.blockInfo.hash
                                                        }
                                                    }), function (err, value) {
                                                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                                                    })
                                                } else {
                                                    let walletReceiver = JSON.parse(value)
                                                    wallets.put(walletIdReceiver, JSON.stringify({
                                                        value: walletReceiver.value + message.amountToSend,
                                                        lastTransaction: {
                                                            block: block.blockInfo.blockNumber,
                                                            hash: block.blockInfo.hash
                                                        }
                                                    }), function (err, value) {
                                                        if (err) return console.log('Ooops!', err) // some kind of I/O error
                                                    })
                                                }
                                            });
                                        }, indexTx * 15);
                                }
                                
                            }
                        });
                      }, index * 400);
                }
            }
        });
    } catch (error) {
        console.log("🌱 ~ file: server.js:900 ~ syncWallets ~ error", error)
        
    }
}
setTimeout(() => {
    syncWallets()
}, 5000);

