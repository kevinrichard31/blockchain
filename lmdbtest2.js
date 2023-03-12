const lmdb = require('lmdb');
const open = lmdb.open;

    let myDB = open({
        path: 'my-db',
        // any options go here, we can turn on compression like this:
        compression: true,
    });

    myDB.transaction(() => {
        myDB.put('greeting', { someText: 'bonjourno!' });
        // 'Hello, World!'
        console.log(myDB.get('greeting').someText)
    });
