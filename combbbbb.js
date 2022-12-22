var combinedItems = items.reduce(function(arr, item) {
    var found = false;
    
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].ip === item.ip) {
            found = true;
            arr[i].count++;
        }
    }
    
    if (!found) {
    		item.count = 1;
        arr.push(item);
    }
    
    return arr;
}, [])

console.log(combinedItems);