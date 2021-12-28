let numbers = []
let bankroll = 2000
let mise = 0
const multiplicateur = 7
let totalmise
let perdu = 0
perdumax = 0
numbers = [0, 2, 5, 8, 12, 15, 17, 16, 23, 22, 28, 29, 35, 34]
let securised = 0
mise = 0.2
totalmise = mise * multiplicateur
totalmise = parseFloat(totalmise.toFixed(2))
console.log(totalmise)
let count = 0
while(true){
    count++
    if(totalmise < 2000){
        let numberfound = getRandomInt(37)
        const found = numbers.find(element => element == numberfound);
        
        console.log(found);
        
        bankroll = bankroll - totalmise // mise
        if(found != undefined){ // gagné
            bankroll = bankroll + ((totalmise / 6) *17) // gain
            console.log(count) // compteur

            console.log("gagné " + bankroll) // console bankroll
            totalmise = 1.4 // reset mise
            if(perdu > perdumax){ // compteur perdumax
                perdumax = perdu
            }
            perdu = 0 // reset perdu
            console.log("perdumax " + perdumax)
            if(bankroll >= 400){
                securised = securised + (bankroll - 100)
                bankroll = 100
                console.log(securised + " securised")
            }
        } else {
            console.log("perdu " + bankroll)
            totalmise = totalmise * 2
            perdu = perdu+1
            if(bankroll <= 0){
                securised = securised - 100
                bankroll = 100
                console.log(securised + " securised")
            }
            if(securised <= -1){
                process.exit()
            }

        }
    } else {
        totalmise = 1.4
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }