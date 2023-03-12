const lmdb = require('lmdb');
const open = lmdb.open;
async function main() {
    let myDB = open({
        path: 'my-db',
        // any options go here, we can turn on compression like this:
        compression: true,
    });
    await myDB.put('greeting', { someText: 'Hello, World!' });
    myDB.get('greeting').someText // 'Hello, World!'
    // or
    myDB.transaction(() => {
        myDB.put('greeting', { someText: 'Hello, World!' });
        myDB.get('greeting').someText // 'Hello, World!'
    });
}

main();