// ************************ //
// Warning: By touching this code, you can be banned from the network.
// The integrity of the network depends on a uniform code and similar functions.
// Attempting to change the code can get you banned from the network.
// ************************ //

var ip = require('ip');
const level = require('level')
const t = level('transactions')
const w = level('wallets')
const iT = level('indexT')

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
    switch (leader) {
        case true:
            break;

        default:
            break;
    }
}, 1000);



function AmILeader() {
    //  On vérifie si je suis validateur
    stackers.includes(ip.address()) ? leader = true : leader = false
    //     let obj = arr.find(o => o.name === 'string 1');

    // console.log(obj);

}



wsServer.on('request', function (request) {
    // Accept the connection of the nodes

    // console.log(connectedPeers.indexOf(request.remoteAddress) > -1) // activer pour la prod
    if (!originIsAllowed(request.origin) || request.remoteAddress.split(":").pop().length < 6 || connectedPeers.includes(request.remoteAddress.split(":").pop()) == true) {

        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.remoteAddress + ' rejected.');
        return;
    }
    console.log(connectedPeers.includes(request.remoteAddress.split(":").pop()))

    var connection = request.accept('echo-protocol', request.origin);



    function validateBlock() {

    }
    connectedPeers.push(request.remoteAddress.split(":").pop()) // Si l'IP existe déjà alors on ajoute pas, sinon on ajoute

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
                connection.sendUTF('GIGANETWORK: message received')

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
                        becomeStacker(result)
                        break;
                    default:
                        console.log(`Sorry, ${result.type} doesn't exist`);
                }
                // console.log(JSON.parse(result.walletToVerify))
                // console.log(JSON.parse(result.signature))

            } catch (err) {
                connection.sendUTF('GIGANETWORK: error');
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
            return o !== connection.remoteAddress.split(":").pop()

        });

        console.log((new Date()) + ' Peer ' + connection.remoteAddress.split(":").pop() + ' disconnected.');
    });




    function becomeStacker(result){

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
        // console.log(result)
        const addressRecovered = verifySignature(result)
        try {
            w.get(addressRecovered, function (err, value) {
                console.log(value)
                console.log("wget")

                if (value == undefined) {
                    connection.sendUTF("Wallet doesn't exist")

                } else {
                    pool.push(result.message) // on push le message dans la pool de transaction
                    console.log(pool)
                    connection.sendUTF('GIGANETWORK: Wallet found and you have sufficient $GIGA spendable')
                }

            })
        } catch (error) {

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

                w.get(address, function (err, value) {
                    console.log(value)
                    console.log("wget")

                    if (value == undefined) {
                        connection.sendUTF('Wallet added')
                        w.put(address, JSON.stringify({
                            value: 0,
                            historyInput: [],
                            historyOutput: [],
                            creationDate: Date.now()
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


});