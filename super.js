let pool = []


var counter = 0;

var looper = setInterval(function(){ 
    counter++;
    console.log("Counter is: " + counter);
    pool.push({
        type: 'becomeStacker',
        message: '{"type":"becomeStacker","date":1646292168018}',
        signature: '{"r":"44e0c75dfdb395c3e93c359f83446f07aa58cb71d5fb929a55a7b6f984138009","s":"affb3847c58f98460b3d6108f73be525c8a14c52dc7ce45cc497978bbbb08db9","recoveryParam":0}'
      })
    if (counter >= 10000)
    {
        clearInterval(looper);
        console.log('finish')
    }

}, 1);

setTimeout(() => {
    pool.push({
        type: 'lala',
        message: '{"type":"becomeStacker","date":1646292168018}',
        signature: '{"r":"44e0c75dfdb395c3e93c359f83446f07aa58cb71d5fb929a55a7b6f984138009","s":"affb3847c58f98460b3d6108f73be525c8a14c52dc7ce45cc497978bbbb08db9","recoveryParam":0}'
      })
}, 200000);

setTimeout(() => {
    let obj = pool.find(o => o.type === 'lala')
    if(obj != undefined) {
        console.log(obj)
        console.log('trouvé')
    }
}, 210000);