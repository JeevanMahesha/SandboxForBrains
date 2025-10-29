const doWrokPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        // resolve([1, 2, 3])
        reject('Failed')
    }, 2000)
})

doWrokPromise.then((result) => {
    console.log('Success :', result)
}).catch((error) => {
    console.log('Fail', error)
})