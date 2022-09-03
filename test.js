const level = require('level')
const wallets = level('wallets')
const blocks = level('blocks')
const infos = level('infos')



blocks.get('index', function (err, value) { // on vérifie le nouveau index
    console.log(value + " valeur du nouveau index") // on affiche le nouveau index
    test()
})

async function test() {
    await blocks.put('index', 1)
    let result = await blocks.get('index')
    console.log(JSON.parse(result))

}

