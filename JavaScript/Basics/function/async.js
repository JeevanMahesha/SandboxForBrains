const fetchData = () => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('Done!');
        }, 1500)
    })
    return promise
}

// async code
setTimeout(() => {
    console.log('Time is Done!');
    fetchData().then(Text => {
        console.log(Text);
        return fetchData()
    }).then(Text1 => {
        console.log(Text1);
    })
}, 2000)

// sync code
console.log('hello');
console.log('World');