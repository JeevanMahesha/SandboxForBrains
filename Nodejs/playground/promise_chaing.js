const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(a + b)
        }, 2000)
    })
}

add(1, 2).then((sum) => {
    console.log(sum);
    return add(sum, 3)
}).then((sum1) => {
    console.log(sum1);
}).catch((e) => {
    console.log(e);
})