const { Level } = require('level')



async function dsfg() {
    // Create a database
const db = new Level('example', { valueEncoding: 'json' })

await db.put('a', 1)

// Add multiple entries
await db.batch([{ type: 'put', key: 'b', value: 2 }])

// Get value of key 'a': 1

try {
    const value = await db.get('f')
    console.log(value)
} catch (error) {
    console.log(error)
    if(error){
        console.log("bite")
    }
}


}
dsfg()