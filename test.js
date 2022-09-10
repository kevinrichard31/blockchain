const level = require('level')
const wallets = level('wallets')
const blocks = level('blocks')
const infos = level('infos')



blocks.get('index', function (err, value) { // on vérifie le nouveau index
    console.log(value) // on affiche le nouveau index
})

// async function test() {
//     await blocks.put('index', 1)
//     let result = await blocks.get('index')
//     console.log(JSON.parse(result))

// }


