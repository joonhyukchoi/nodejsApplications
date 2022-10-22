const promiseTest = () => {
    return new Promise((resolve, reject) => {
        console.log("promise callback")
        reject(new Error('err'))
    })
}

promiseTest()
.then(console.log)
.then((resolve) => {
    console.log("second then method")
    })
.catch(console.log)

console.log("in first stack")