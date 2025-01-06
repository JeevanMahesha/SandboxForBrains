const score = [10, 30, 15, 25, 51, 40, 5]
const filtered = score.filter((value) => {
        return value > 20;
    })
    // console.log(filtered);

// MAP function
const price = [10, 50, 88, 6, 44, 58, 79, 100]
const salePrice = price.map(value => value / 2)
    // console.log(salePrice);


// REDUCE function
const result = score.reduce((acc, curr) => {
    if (curr >= 30) {
        acc += 1
    }
    return acc
}, 0)

// console.log(result);

// FIND function
const find_fun = score.find((value) => {
    return value > 50;
})
console.log(find_fun);

// SORT Function
const sort_fun = score