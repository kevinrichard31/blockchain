let numbers = []
let betencours = false
let firsttime = true
let bankroll = 133.02
let mise = 0
const multiplicateur = 7
let totalmise
let perdu = 0
let lastnumber = undefined
perdumax = 0
numbers = [0, 2, 5, 8, 12, 15, 17, 16, 23, 22, 28, 29, 35, 34]
let securised = 0
mise = 0.2
totalmise = mise * multiplicateur
totalmise = parseFloat(totalmise.toFixed(2))
console.log(totalmise)
let count = 0
var robot = require("robotjs");
let connect = false
let found
// setInterval(() => {
//     var mouse = robot.getMousePos();
//     console.log(mouse)
// }, 100);
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function (error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function (error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        connect = false
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function (message) {
        connect = true
        if (message.type === 'utf8') {
            // console.log(JSON.parse(message.utf8Data));

            switch (JSON.parse(message.utf8Data).type) {
                case 'roulette.winSpots':
                    lastnumber = parseInt(JSON.parse(message.utf8Data).args.code)
                    console.log(lastnumber);

                    found = numbers.find(element => element == lastnumber);
                    console.log(found)
                    if(found != undefined && betencours == true){
                        betencours = false
                        bankroll = bankroll + (mise*17)
                    } else {
                        mise = mise*2
                    }




                    break;
                case 'roulette.tableState':
                    if (JSON.parse(message.utf8Data).args.state == 'BETS_OPEN' && bankroll <= 200) {
                        console.log("bets open")
                        if (betencours == true) {
                            bankroll = bankroll - (mise*7)
                            setTimeout(() => {
                                robot.moveMouse(3019, 923);
                                robot.mouseClick();
                            }, 1000);
                            setTimeout(() => {
                                robot.moveMouse(3019, 923);
                                robot.mouseClick();
                            }, 1500);
                            console.log("bankroll : ")
                            console.log(bankroll)
                        } else if (betencours == false) {


                            bankroll = bankroll - 1.4
                            mise = 0.2
                            selectnumbers()
                            betencours = true
                            console.log("bankroll : ")
                            console.log(bankroll)
                        }
                    }
                    break;
                default:
            }

            //   if(typeof JSON.parse(message.utf8Data).args.state != undefined){
            //       console.log(JSON.parse(message.utf8Data).args.state)
            //   }

        }
    });

    connection.sendUTF(JSON.stringify({ "log": { "type": "CLIENT_BET_CHIP", "value": { "amount": -0.2, "type": "undo", "chips": "-0.2@bet_1", "codes": { "ROU_1Red": -0.2 }, "balance": 230.5, "viewType": "Immersive (Overlay, Full screen, Multi-camera View)", "gameType": "roulette", "appVersion": 4, "isChipPlacedByPressingOnEmptyBetspot": false, "tableTotalMinLimit": 0.2, "tableTotalMaxLimit": 150000, "currency": "EUR", "chipStack": [0.2, 0.5, 1, 5, 25, 100, 500], "defaultChip": 2, "tableMinLimit": 0.2, "tableMaxLimit": 2000, "channel": "PCMac", "orientation": "landscape", "gameDimensions": { "width": 908.4375, "height": 511 }, "gameId": "16c54e45229bc112eef991d1" } } }))

    function sendNumber() {
        if (connection.connected) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
});

client.connect('wss://live.wirebankers.com/public/roulette/player/game/LightningTable01/socket?messageFormat=json&instance=tkisa-pydzx6nfupxwo2q4-on5d2ae54pi4dwq5&tableConfig=on5d2ae54pi4dwq5&EVOSESSIONID=pydzx6nfupxwo2q4pyr7kdcbupxqlbcoeda418bc579c457f868341a82cd23ece3dc0687cd95accdb&client_version=6.20211231.62646.9909-7430d01054');


function selectnumbers() {
    setTimeout(() => {
        setTimeout(() => {
            robot.moveMouse(2608, 780);
            robot.mouseClick();
        }, 500);
        setTimeout(() => {
            robot.moveMouse(2697, 781);
            robot.mouseClick();
        }, 1000);
        setTimeout(() => {
            robot.moveMouse(2784, 752);
            robot.mouseClick();
        }, 1500);
        setTimeout(() => {
            robot.moveMouse(2853, 799);
            robot.mouseClick();
        }, 2000);
        setTimeout(() => {
            robot.moveMouse(2935, 798);
            robot.mouseClick();
        }, 2500);
        setTimeout(() => {
            robot.moveMouse(3027, 798);
            robot.mouseClick();
        }, 3000);
        setTimeout(() => {
            robot.moveMouse(3114, 799);
            robot.mouseClick();
        }, 3500);
    }, 1000);
}


setInterval(() => {
    // count++
    // if(totalmise < 2000){
    // let numberfound = getRandomInt(37)
    // const found = numbers.find(element => element == numberfound);

    // console.log(found);

    // bankroll = bankroll - totalmise // mise
    // if(found != undefined){ // gagné
    //     bankroll = bankroll + ((totalmise / 6) *17) // gain
    //     console.log(count) // compteur

    //     console.log("gagné " + bankroll) // console bankroll
    //     totalmise = 1.4 // reset mise
    //     if(perdu > perdumax){ // compteur perdumax
    //         perdumax = perdu
    //     }
    //     perdu = 0 // reset perdu
    //     console.log("perdumax " + perdumax)
    //     if(bankroll >= 300){
    //         securised = securised + (bankroll - 100)
    //         bankroll = 100
    //         console.log(securised + " securised")
    //     }
    // } else {
    //     console.log("perdu " + bankroll)
    //     totalmise = totalmise * 2
    //     perdu = perdu+1
    //     if(bankroll <= 0){
    //         securised = securised - 100
    //         bankroll = 100
    //         console.log(securised + " securised")
    //     }
    //     if(securised <= -1){
    //         process.exit()
    //     }

    // }
    // } else {
    //     totalmise = 1.4
    // }
}, 10);

// while(true){
//     count++
//     if(totalmise < 2000){
//         let numberfound = getRandomInt(37)
//         const found = numbers.find(element => element == numberfound);

//         console.log(found);

//         bankroll = bankroll - totalmise // mise
//         if(found != undefined){ // gagné
//             bankroll = bankroll + ((totalmise / 6) *17) // gain
//             console.log(count) // compteur

//             console.log("gagné " + bankroll) // console bankroll
//             totalmise = 1.4 // reset mise
//             if(perdu > perdumax){ // compteur perdumax
//                 perdumax = perdu
//             }
//             perdu = 0 // reset perdu
//             console.log("perdumax " + perdumax)
//             if(bankroll >= 300){
//                 securised = securised + (bankroll - 100)
//                 bankroll = 100
//                 console.log(securised + " securised")
//             }
//         } else {
//             console.log("perdu " + bankroll)
//             totalmise = totalmise * 2
//             perdu = perdu+1
//             if(bankroll <= 0){
//                 securised = securised - 100
//                 bankroll = 100
//                 console.log(securised + " securised")
//             }
//             if(securised <= -1){
//                 process.exit()
//             }

//         }
//     } else {
//         totalmise = 1.4
//     }
// }

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}