let numbers = []
let bankroll = 100
let mise = 0
const multiplicateur = 7
let totalmise
let perdu = 0
perdumax = 0
playable = false
numbers = [0, 2, 5, 8, 12, 15, 17, 16, 23, 22, 28, 29, 35, 34]
partycounter = 0


mise = 0.2
totalmise = mise * multiplicateur
totalmise = parseFloat(totalmise.toFixed(2))
console.log(totalmise)
let numberfound
let found
while(true){

    if (totalmise < 2000) {
        
        if (playable == true) {
            numberfound = getRandomInt(37)
            found = numbers.find(element => element == numberfound);

            console.log(found);

            bankroll = bankroll - totalmise
            if (found != undefined) {
                bankroll = bankroll + ((totalmise / 6) * 17)
                console.log("gagné " + bankroll)
                totalmise = 1.4
                if (perdu > perdumax) {
                    perdumax = perdu
                }
                perdu = 0
                console.log("perdumax " + perdumax)
                playable = false
                console.log(partycounter + " partycounter")
            } else {
                console.log("perdu " + bankroll)
                totalmise = totalmise * 2
                perdu = perdu + 1
                if (bankroll <= 0) {
                    process.exit()
                }

            }
        } else {
            numberfound = getRandomInt(37)
            found = numbers.find(element => element == numberfound);
            if(found != undefined){
                perdu = 0
            } else {
                perdu++
                if(perdu >=13){
                    playable = true
                }
            }
            if(partycounter >= 50000){
                process.exit()
            }
            partycounter++
        }
    } else {
        totalmise = 1.4
    }
}




function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}