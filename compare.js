const dircompare = require('dir-compare');

const fs = require('fs')
const options = { compareSize: true };
// Multiple compare strategy can be used simultaneously - compareSize, compareContent, compareDate, compareSymlink.
// If one comparison fails for a pair of files, they are considered distinct.
const path1 = './indexT';
const path2 = './indexW';

// Synchronous
const res = dircompare.compareSync(path1, path2, options)
print(res)

// Asynchronous
dircompare.compare(path1, path2, options)
    .then(res => print(res))
    .catch(error => console.error(error));


function print(result) {
    console.log('Directories are %s', result.same ? 'identical' : 'different')

    console.log(result.left)
    let start = []
    result.diffSet.forEach(element => {
        //   console.log(element)
        if (element.path1 == './indexT') {
            start.push(element)
            console.log(element.name1)
        }

    });
    console.log(start.length)
}


fs.readFile('indexT/000414.ldb', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    console.log(data)


    fs.writeFile('helloworld.txt', data, function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });
})