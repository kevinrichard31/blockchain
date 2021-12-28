let numbers = []
let bankroll = 100
let mise = 0
const multiplicateur = 7
let totalmise
let perdu = 0
perdumax = 0
numbers = [0, 2, 5, 8, 12, 15, 17, 16, 23, 22, 28, 29, 35, 34]
counterzero = 0


mise = 0.2
totalmise = mise * multiplicateur
totalmise = parseFloat(totalmise.toFixed(2))
console.log(totalmise)

setInterval(() => {
    counterzero++
    let random = getRandomInt(37)
    bankroll = bankroll - 0.8
if(random == 0 || random ==1 || random == 2 || random == 3){
    console.log(0)
    bankroll = bankroll + (mise*36)
    console.log(counterzero + " bankroll :" + bankroll)
    counterzero = 0
    
}

}, 1);







function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }